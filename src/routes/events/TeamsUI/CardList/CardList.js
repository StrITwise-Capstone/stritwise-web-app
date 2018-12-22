import React from 'react';
import {
  Grid,
  List,
  ListItem,
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
        isLoading: false,
    }

    handleChangePage = (event, page) => {
        const { firestore, eventuid } = this.props;
        const { lastVisible,firstVisible } = this.state;
        const callback = (array,lastVisible,page,firstVisible) => {
            this.setState({teamsList : array, lastVisible , page, firstVisible})
        }
        if (page > this.state.page){
        var first = firestore.collection("events").doc(eventuid).collection("teams")
        .orderBy("team_name",'asc')
        .limit(5)
        .startAfter(lastVisible);
        var array = [];
        first.get().then(function (documentSnapshots) {
        // Get the last visible document
        var lastVisible = documentSnapshots.docs[documentSnapshots.docs.length-1];
        var firstVisible = documentSnapshots.docs[0];
        documentSnapshots.forEach(function(documentSnapshots){
            array.push({
                uid: documentSnapshots.id,
                data:documentSnapshots.data()});
        }
        );
        callback(array,lastVisible,page,firstVisible);
        })
        }
        if (page < this.state.page){
            var first = firestore.collection("events").doc(eventuid).collection("teams")
            .orderBy("team_name",'desc')
            .limit(5)
            .startAfter(firstVisible);
            var array = [];
        first.get().then(function (documentSnapshots) {
        // Get the last visible document
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

    mapping = () => {
        const { match } = this.props;
        const { teamsList } = this.state;
         return Object.keys(teamsList).map(teamuid => (
            <ListItem key={teamuid}>
                <TeamCard teamuid={teamsList[teamuid].uid} eventuid={match.params.id}/>
            </ListItem>))
    }

    getData = () => {
        const { firestore, eventuid } = this.props;
        const callback = (array,lastVisible) => {
            this.setState({teamsList : array, lastVisible })
        }
        var first = firestore.collection("events").doc(eventuid).collection("teams")
        .orderBy("team_name")
        .limit(5);
        var array = [];
        first.get().then(function (documentSnapshots) {
        // Get the last visible document
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

    componentWillMount = () =>{
        this.getData();
    }

    render(){
        const {
            teamsList,
        } = this.state;
        const { page } = this.state;
        const {
            teamsListCount
        } = this.props;
        return (
        <div>
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
            />
            <div style={{ margin: '0 auto' }}/>
            <Grid
                container
                alignContent="center"
                justify="center"
            >
            <List
            >
            
            {teamsList
                && this.mapping()
            }
            </List>
            </Grid>
        </div>
        );
    }
}


const mapStateToProps = (state) => {
    return {
        teamsListCount: state.firestore.data.teamsListCount,
    }
};


export default compose(withRouter,
firestoreConnect((props) => [
    {
        collection:'events', doc:`${props.match.params.id}`, subcollections: [{collection:'teams'}], storeAs: 'teamsListCount'
    },
    ]),
    connect(mapStateToProps)
)(cardList);