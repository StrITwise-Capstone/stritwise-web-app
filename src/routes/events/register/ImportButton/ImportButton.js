import React, { Component } from 'react';
import { connect } from 'react-redux';
import { 
  Input, 
  Button,
  MenuItem,
  OutlinedInput,
  Typography,
  TextField,
  FormControl,
} from '@material-ui/core';
import Papa from 'papaparse';
import { firestoreConnect } from 'react-redux-firebase';
import { withStyles } from '@material-ui/core/styles'
import { compose } from 'redux';
import { withSnackbar } from 'notistack';
import * as d3 from 'd3';
import classNames from 'classnames';
import NoSsr from '@material-ui/core/NoSsr';
import Paper from '@material-ui/core/Paper';
import Chip from '@material-ui/core/Chip';
import CancelIcon from '@material-ui/icons/Cancel';
import { emphasize } from '@material-ui/core/styles/colorManipulator';

import Select from '../../../../components/UI/DropdownField/DropdownField';

function validateEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}
function validation(team){
  var bool = true;
  for (var i = 0; i < team.values.length; i++) {
    if (team.values[i]['Team Name'] === '' && team.values[i]['Team Name'].length < 1)
      bool = false;
    if (team.values[i]['First Name'].length < 1 && team.values[i]['Last Name'].length < 1)
      bool = false;
    if (team.values[i]['Phone Number']&& team.values[i]['Phone Number'].match(/[a-z]/i) && team.values[i]['Phone Number'].length !== 8)
      bool = false;
    if (team.values[i]['Email'] === '' && validateEmail(team.values[i]['Email']) === false)
      bool = false;
    if (team.values[i]['Emergency Contact Name'] == '' && team.values[i]['Emergency Contact Mobile'] == '' && team.values[i]['Relation to Participant'] == '')
     bool = false;
     if (team.values[i]['Emergency Contact Mobile'] &&team.values[i]['Emergency Contact Mobile'].match(/[a-z]/i) && team.values[i]['Emergency Contact Mobile'].length !== 8)
     bool = false;
  }
  return bool;
}

class ImportButton extends Component {
  state = {
    data: null,
    file: null,
    school_name: '',
  }

  handleChange = (event) =>{
    var input = event.target.files[0];
    this.setState({ file : input});
  }

  handleDropboxChange = name => value => {
    this.setState({ [name]: value});
  };

  uploadTeams = () =>{
    
    const input = this.state.file;
    if (!input)
      return;
    const setData = (result)=>{
      const { enqueueSnackbar, firestore, updatingStatus, eventuid } = this.props;
      const { school_name } = this.state;
      updatingStatus(false);
      var dataByTeamName = d3.nest()
      .key(function(d) { return d['Team Name']; })
      .entries(result);
      //Query for school where school name matches
        Object.keys(dataByTeamName).map(TeamIndex => {
          var team = dataByTeamName[TeamIndex];
          //Do verification
          if (validation(team)){
          //Query for firestore where team name exist
          var teamRef = firestore.collection("events").doc(eventuid).collection("teams");
          var teamName = team.key;
          var query = teamRef.where("team_name","==", `${teamName}`);
          query.get().then(querySnapshot => {
            if (querySnapshot.empty === false){
              const teamuid = querySnapshot.docs[0].id;
              for (var i = 0; i < team.values.length; i++) {
                firestore.collection("events").doc(eventuid).collection("students").add({
                  school_id: school_name.value,
                  team_id: teamuid,
                  first_name: team.values[i]['First Name'],
                  last_name: team.values[i]['Last Name'],
                  mobile: team.values[i]['Phone Number'],
                  email: team.values[i]['Email'],
                  badge_name: team.values[i]['Badge Name'],
                  dietary_restriction: team.values[i]['Dietary Restrictions'],
                  remarks: team.values[i]['Remarks'],
                  emergency_contacts : {
                    name: team.values[i]['Emergency Contact Name'],
                    mobile: team.values[i]['Emergency Contact Mobile'],
                    relation: team.values[i]['Relation to Participant'],
                  },
                  created_At: new Date(Date.now()),
                  modified_At: new Date(Date.now()),
                }).then(()=>{
                  enqueueSnackbar('Added 1 student...', {
                    variant: 'info',
                  });
                })
              }
              updatingStatus(true);
              return;
            }
            else{
              firestore.collection("events").doc(eventuid).collection("teams").add({
                team_name: team.key,
                credit:0,
                created_At: new Date(Date.now()),
                modified_At: new Date(Date.now()),
              }).then((docRef)=>{
                enqueueSnackbar('Added Team...', {
                  variant: 'info',
                });
                for (var i = 0; i < team.values.length; i++) {
                  firestore.collection("events").doc(eventuid).collection("students").add({
                    team_id: docRef.id,
                    school_id: school_name.value,
                    first_name: team.values[i]['First Name'],
                    last_name: team.values[i]['Last Name'],
                    mobile: team.values[i]['Phone Number'],
                    email: team.values[i]['Email'],
                    badge_name: team.values[i]['Badge Name'],
                    dietary_restriction: team.values[i]['Dietary Restrictions'],
                    remarks: team.values[i]['Remarks'],  
                    emergency_contacts: {
                      name: team.values[i]['Emergency Contact Name'],
                      mobile: team.values[i]['Emergency Contact Mobile'],
                      relation: team.values[i]['Relation to Participant'],
                    },
                    created_At: new Date(Date.now()),
                    modified_At: new Date(Date.now()),
                  }).then(()=>{
                    enqueueSnackbar('Added 1 student...', {
                      variant: 'info',
                    });
                  })
                }
              })
              updatingStatus(true);
              return;
            }
          })
        }
      }
      )
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
    const { schools, classes } = this.props;
    return (
      <React.Fragment>
        <div>
        <Typography variant="h6" component="h5">Upload Excel For Teams (*Only CSV*)</Typography> 
        <Typography component="p"><a href="https://drive.google.com/file/d/1FlHPvk59R1W3b9Q-XFxuXTWduyzseQGo/view?usp=sharing">Download template excel</a></Typography>
        <div>
          <Typography component="p">Select school</Typography>
          <Select
            name="school_name"
            options={schools}
            value={this.state.school_name}
            onChange={this.handleDropboxChange('school_name')}
            placeholder="Select a school"
            label="Select a school"
          />
          </div>
        <Input type="file" onChange={this.handleChange}></Input>
        <Button onClick={this.uploadTeams}>Upload</Button>
        </div>
      </React.Fragment>
    );
  }
}


export default compose(withSnackbar,firestoreConnect(),
  )(ImportButton);
