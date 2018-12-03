import React from 'react';
import PropTypes from 'prop-types';
import {
  Grid,
} from '@material-ui/core/';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firestoreConnect } from 'react-redux-firebase';

import TeamCard from '../Card/TeamCard';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
});

class cardList extends React.Component {

    render(){
        const {
            match,
            teamsList,
        } = this.props;

        return (
        <div>
            <div style={{ margin: '0 auto' }}/>
            <Grid
            container
            spacing={24}
            justify="space-evenly"
            alignItems="center"
            >
            {teamsList
                && Object.keys(teamsList).map(teamuid => (
                <Grid item>
                    <TeamCard event={teamsList[teamuid]} teamuid={teamuid} eventuid={match.params.id}/>
                </Grid>))
                }
            </Grid>
        </div>
        );
    }
}

cardList.propTypes = {
  classes: PropTypes.object.isRequired,
};


const mapStateToProps = (state) => {
    console.log(state);
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