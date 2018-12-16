import React from 'react';
import {
  Grid,
  List,
  ListItem,
} from '@material-ui/core/';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firestoreConnect } from 'react-redux-firebase';

import TeamCard from '../Card/TeamCard';

class cardList extends React.Component {
    mapping = () => {
        const { teamsList , match } = this.props;
         return Object.keys(teamsList).map(teamuid => (
            <ListItem key={teamuid}>
                <TeamCard event={teamsList[teamuid]} teamuid={teamuid} eventuid={match.params.id}/>
            </ListItem>))
    }
    render(){
        const {
            teamsList,
        } = this.props;
        return (
        <div>
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
        teamsList: state.firestore.data.teamsList,
    }
};


export default compose(withRouter,
firestoreConnect((props) => [
    {
        collection:'events', doc:`${props.match.params.id}`, subcollections: [{collection:'teams'}], storeAs: 'teamsList'
    },
    ]),
    connect(mapStateToProps)
)(cardList);