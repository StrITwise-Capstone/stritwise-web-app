import React from 'react';
import {
  Grid,
  CircularProgress,
  Table,
} from '@material-ui/core/';
import { withStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firestoreConnect } from 'react-redux-firebase';
import TablePagination from '@material-ui/core/TablePagination';

import TablePaginationActions from './TablePaginationActions'
import TeamCard from '../Card/TeamCard';

const actionsStyles = theme => ({
  root: {
    flexShrink: 0,
    color: theme.palette.text.secondary,
    marginLeft: theme.spacing.unit * 2.5,
  },
});

const TablePaginationActionsWrapped = withStyles(actionsStyles, { withTheme: true })(
  TablePaginationActions,
);
class cardList extends React.Component {
    state = {
        eventsList : null,
        page: 0,
        rowsPerPage: 5,
        rows:3,
        lastVisible:null,
        firstVisible:null,
        isNotLoading: true,
    }

    handleChangePage = (event, page) => {
        const { firestore, eventuid } = this.props;
        const { lastVisible,firstVisible } = this.state;
        this.setState({isNotLoading : false})
        const callback = (array,lastVisible,page,firstVisible) => {
            this.setState({teamsList : array, lastVisible , page, firstVisible, isNotLoading : true})
        }
        var array = [];
        var first = null;
        if (page > this.state.page) {
            first = firestore.collection("events").doc(eventuid).collection("teams")
            .orderBy("team_name",'asc')
            .limit(5)
            .startAfter(lastVisible);
            first.get().then(function (documentSnapshots) {
            // Get the last visible document
            var lastVisible = documentSnapshots.docs[documentSnapshots.docs.length-1];
            var firstVisible = documentSnapshots.docs[0];
            documentSnapshots.forEach(function(documentSnapshots){
                array.push({
                    uid: documentSnapshots.id,
                    data:documentSnapshots.data()});
            });
            callback(array.reverse(),lastVisible,page,firstVisible);
            })
        }
        if (page < this.state.page) {
            first = firestore.collection("events").doc(eventuid).collection("teams")
                .orderBy("team_name",'desc')
                .limit(5)
                .startAfter(firstVisible);
            this.setState({isNotLoading:false})
            first.get().then(function (documentSnapshots){
                var lastVisible = documentSnapshots.docs[0];
                var firstVisible = documentSnapshots.docs[documentSnapshots.docs.length-1];
                documentSnapshots.forEach(function(documentSnapshots){
                    array.push({
                        uid: documentSnapshots.id,
                        data:documentSnapshots.data()});
                }
                );
            callback(array.reverse(),lastVisible,page,firstVisible);
        })
        }
    }

    getData = () => {
        const { firestore, eventuid } = this.props;
        const { isNotLoading } = this.state;
        const callback = (array,lastVisible) => {
            this.setState({teamsList : array, lastVisible, page:0, isNotLoading: true });
        }
        var first = firestore.collection("events").doc(eventuid).collection("teams")
        .orderBy("team_name")
        .limit(5);
        var array = [];
        this.setState({isNotLoading: false});
        first.get().then(function (documentSnapshots) {
        var lastVisible = documentSnapshots.docs[documentSnapshots.docs.length-1];
        documentSnapshots.forEach(function(documentSnapshots){
            array.push({
                uid: documentSnapshots.id,
                data:documentSnapshots.data()});
        }
        );
        callback(array,lastVisible);
    })

    }

    componentDidMount = () =>{
        this.getData();
    }

    render(){
        const {
            teamsList, isNotLoading, page
        } = this.state;
        const {
            teamsListCount, match, currentevent
        } = this.props;
        
        return (
        <React.Fragment>
            <Table><tbody><tr>
            <TablePagination
                colSpan={3}
                rowsPerPageOptions={[5]}
                count={teamsListCount ? Object.keys(teamsListCount).length : 0}
                page={page}
                SelectProps={{
                native: true,
                }}
                rowsPerPage={5}
                onChangePage={this.handleChangePage}
                ActionsComponent={TablePaginationActionsWrapped}
                style={{'float':'left'}}
            />
            </tr></tbody></Table>
            <div style={{ margin: '0 auto' }}/>
            <Grid
                container
                direction="row"
                justify="space-between"
                alignItems="flex-start"
                spacing={8}
            >
            { !isNotLoading && 
                <CircularProgress/>
            }
            {teamsList && isNotLoading
                && Object.keys(teamsList).map(teamuid => {
                    return <Grid item xs={6} key={teamuid} style={{height:'100%'}}>
                        <TeamCard teamuid={teamsList[teamuid].uid} eventuid={match.params.id} currentevent={currentevent}
                        update={()=>{this.getData()}}
                        />
            </Grid>;})
            }
            </Grid>
        </React.Fragment>
        );
    }
}


const mapStateToProps = (state) => {
    return {
        teamsListCount: state.firestore.data.teamsListCount,
    }
};


export default compose(withRouter,
    connect(mapStateToProps),
    firestoreConnect((props) => [
    {
        collection:'events', doc:`${props.match.params.id}`, subcollections: [{collection:'teams'}], storeAs: 'teamsListCount'
    },
    ]),
)(cardList);