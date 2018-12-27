import React, { Component } from 'react';
import { connect } from 'react-redux';
import { 
  Input, 
  Button,
  MenuItem,
  Select,
  OutlinedInput,
} from '@material-ui/core';
import Papa from 'papaparse';
import { withRouter } from 'react-router';
import { firestoreConnect } from 'react-redux-firebase';
import { compose } from 'redux';
import { withSnackbar } from 'notistack';
import * as d3 from 'd3';

function validateEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}
function validation(team){
  var bool = true;
  for (var i = 0; i < team.values.length; i++) {
    if (team.values[i]['Team Name'] == '' && team.values[i]['Team Name'].length < 1)
      bool = false;
  
    if (team.values[i]['First Name'].length < 1 && team.values[i]['Last Name'].length < 1)
      bool = false;
    if (team.values[i]['Phone Number'].match(/[a-z]/i) && team.values[i]['Phone Number'].length != 8)
      bool = false;
    if (team.values[i]['Email'] == '' && validateEmail(team.values[i]['Email']) == false)
      bool = false;
    if (team.values[i]['Emergency Contact Name'] == '' && team.values[i]['Emergency Contact Mobile'] == '' && team.values[i]['Relation to Participant'] == '')
     bool = false;
     if (team.values[i]['Emergency Contact Mobile'].match(/[a-z]/i) && team.values[i]['Emergency Contact Mobile'].length != 8)
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

  handleDropboxChange = event => {
    this.setState({ [event.target.name]: event.target.value});
  };

  uploadTeams = () =>{
    const input = this.state.file;
    if (!input)
      return;
    
    const setData = (result)=>{
      const { enqueueSnackbar, firestore, match} = this.props;
      const { school_name } = this.state;
      const eventuid = match.params.id;
      var dataByTeamName = d3.nest()
      .key(function(d) { return d['Team Name']; })
      .entries(result);
      //Query for school where school name matches
      var schoolRef = firestore.collection("schools");
      var schoolQuery = schoolRef.where("name",'==',`${school_name}`);
      schoolQuery.get().then((querySnapshot) =>{
        var school_id = '';
        querySnapshot.forEach((docRef)=>{
          school_id = docRef.id;
        })
        Object.keys(dataByTeamName).map(TeamIndex => {
          var team = dataByTeamName[TeamIndex];
          //Do verification
          if (validation(team)){
          //Query for firestore where team name exist
          var teamRef = firestore.collection("events").doc(match.params.id).collection("teams");
          var teamName = team.key;
          var query = teamRef.where("team_name","==", `${teamName}`);
          query.get().then(querySnapshot => {
            if (querySnapshot.empty === false){
              const teamuid = querySnapshot.docs[0].id;
              for (var i = 0; i < team.values.length; i++) {
                firestore.collection("events").doc(eventuid).collection("students").add({
                  school_id: school_id,
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
                  }
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
                  firestore.collection("events").doc(eventuid).collection("students").add({
                    team_id: docRef.id,
                    school_id: school_id,
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
                    }
                  }).then(()=>{
                    enqueueSnackbar('Added 1 student...', {
                      variant: 'info',
                    });
                  })
                }
              })
            }
          })
        }
        })
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
    const { schoolsList } = this.props;
    return (
      <React.Fragment>
        <div>
        <h3>Upload Excel For Teams (*Only CSV*)</h3> 
        <p><a href="https://drive.google.com/file/d/1FlHPvk59R1W3b9Q-XFxuXTWduyzseQGo/view?usp=sharing">Download the excel here</a></p>
        <div>
          <Select
            value={this.state.school_name}
            onChange={this.handleDropboxChange}
            input={
              <OutlinedInput
                labelWidth={100}
                name="school_name"
            />
            }
          >
            {schoolsList && 
              Object.keys(schoolsList).map(school => 
            (
              <MenuItem key={school} value={schoolsList[school].name}>{schoolsList[school].name}</MenuItem>
            ))
            }
          </Select>
          </div>
        <Input type="file" onChange={this.handleChange}></Input>
        <Button onClick={this.uploadTeams}>Upload</Button>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    schoolsList: state.firestore.data.schoolsList,
  }
};

export default compose(withSnackbar,
  connect(mapStateToProps),
  firestoreConnect((props) => [
  {
    collection:'schools',storeAs:`schoolsList`
  },
  ]),
withRouter)(ImportButton);
