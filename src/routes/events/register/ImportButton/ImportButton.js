import React, { Component } from 'react';
import { 
  Input, 
  Button, 
  withStyles,
} from '@material-ui/core';
import Papa from 'papaparse';
import { withRouter } from 'react-router';
import { firestoreConnect } from 'react-redux-firebase';
import { compose } from 'redux';
import { withSnackbar } from 'notistack';
import * as d3 from 'd3';

class ImportButton extends Component {
  state = {
    data: null,
    file: null,
  }
  handleChange = (event) =>{
    var input = event.target.files[0];
    this.setState({ file : input});
  }

  uploadTeams = () =>{
    const input = this.state.file;
    if (!input)
      return;
    
    const setData = (result)=>{
      const { enqueueSnackbar, firestore, match} = this.props;
      const eventuid = match.params.id;
      var dataByTeamName = d3.nest()
      .key(function(d) { return d['Team Name']; })
      .entries(result);
      console.log(dataByTeamName);
      Object.keys(dataByTeamName).map(TeamIndex => {
        var team = dataByTeamName[TeamIndex];
        //Query for firestore where team name exist
        var teamRef = firestore.collection("events").doc(match.params.id).collection("teams");
        var teamName = team.key;
        console.log(teamName);
        var query = teamRef.where("team_name","==", `${teamName}`);
        query.get().then(querySnapshot => {
          if (querySnapshot.empty == false){
            const teamuid = querySnapshot.docs[0].id;
            for (var i = 0; i < team.values.length; i++) {
              firestore.collection("events").doc(match.params.id).collection("teams").doc(teamuid).collection("students").add({
                first_name: team.values[i]['First Name'],
                last_name: team.values[i]['Last Name'],
                phone_number: team.values[i]['Phone Number'],
                email: team.values[i]['Email'],
                badge_name: team.values[i]['Badge Name'],
                dietary_restriction: team.values[i]['Dietary Restrictions'],
                remarks: team.values[i]['Remarks'],
              }).then(()=>{
                enqueueSnackbar('Added 1 student...', {
                  variant: 'info',
                });
              })
            }
          }
          else{
            firestore.collection("events").doc(eventuid).collection("teams").add({
              team_name: team.key,
              credit:0,
            }).then((docRef)=>{
              enqueueSnackbar('Added Team...', {
                variant: 'info',
              });
              for (var i = 0; i < team.values.length; i++) {
                firestore.collection("events").doc(match.params.id).collection("teams").doc(docRef.id).collection("students").add({
                  first_name: team.values[i]['First Name'],
                  last_name: team.values[i]['Last Name'],
                  phone_number: team.values[i]['Phone Number'],
                  email: team.values[i]['Email'],
                  badge_name: team.values[i]['Badge Name'],
                  dietary_restriction: team.values[i]['Dietary Restrictions'],
                  remarks: team.values[i]['Remarks'],
                }).then(()=>{
                  enqueueSnackbar('Added 1 student...', {
                    variant: 'info',
                  });
                })
              }
            })
          }
        })
      })
    }

    var reader = new FileReader()
    reader.onload = function(event){
      var contents = event.target.result;
      let array = []
      var result = Papa.parse(contents,{
        delimiter: "",	// auto-detect
        newline: "",	// auto-detect
        quoteChar: '"',
        escapeChar: '"',
        header: true,
        preview: 0,
        encoding: "",
        worker: false,
        comments: false,
        complete: function(results) {
          return array;
        },
        skipEmptyLines: true,
      })
      setData(result.data);
    }
    reader.readAsText(input);
  }

  render() {
    return (
      <React.Fragment>
        <div>
        <h3>Upload Excel For Teams</h3>
        <Input type="file" onChange={this.handleChange}></Input>
        <Button onClick={this.uploadTeams}>Upload</Button>
        </div>
      </React.Fragment>
    );
  }
}

export default compose(withSnackbar, firestoreConnect(), withRouter)(ImportButton);
