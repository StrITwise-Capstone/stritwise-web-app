import React from 'react';
import { Formik, Form, Field } from 'formik';
import {
  Button,
} from '@material-ui/core';
import { withSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import Input from '@material-ui/core/Input';
import Papa from 'papaparse';
import { firestoreConnect } from 'react-redux-firebase';
import { compose } from 'redux';
import * as d3 from 'd3';

import * as util from '../../../../../helper/util';
import Select from '../../../../../components/UI/Select/Select';

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
    if (team.values[i]['Emergency Contact Name'] === undefined && team.values[i]['Emergency Contact Mobile'] === undefined && team.values[i]['Relation to Participant'] === undefined)
     bool = false;
    if (team.values[i]['Emergency Contact Mobile'] &&team.values[i]['Emergency Contact Mobile'].match(/[a-z]/i) && team.values[i]['Emergency Contact Mobile'].length !== 8)
     bool = false;
  }
  return bool;
}
class AddUserForm extends React.Component {
  handleSubmit = (values, { 
     props = this.props, 
     setSubmitting
   }) => {
  
    const setData = (result) => {
      const { enqueueSnackbar, firestore, eventuid, handleClose, refreshState, teacherId } = this.props;
      const school_id = values.school.value;
      var dataByTeamName = d3.nest()
      .key(function(d) { return d['Team Name']; })
      .entries(result);
      var isValid = true;
      Object.keys(dataByTeamName).map(TeamIndex=>{
        var team = dataByTeamName[TeamIndex];
        if(!validation(team)){
          enqueueSnackbar('Error Adding Team...',{
            variant:'error',
          })
          isValid = false;
        }
      });
      if (isValid){
      //Query for school where school name matches
        Object.keys(dataByTeamName).map(TeamIndex => {
          var team = dataByTeamName[TeamIndex];
          //Do verification
          if (validation(team)){
            return firestore.collection("events").doc(eventuid).collection("teams").add({
              team_name: team.key,
              credit:0,
              teacher_id: teacherId,
              created_At: new Date(Date.now()),
              modified_At: new Date(Date.now()),
              school_id: school_id,
            }).then((docRef)=>{
              enqueueSnackbar('Added 1 Team...', {
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
                  },
                  created_At: new Date(Date.now()),
                  modified_At: new Date(Date.now()),
                }).finally(()=>{
                  if (i === team.values.length){
                  enqueueSnackbar(`Added ${i} student...`, {
                    variant: 'info',
                  });
                  refreshState();
                  }
                })
              }
              handleClose();
            })
          }
        })
      }
    }
   const input = values.file;
   if (!input)
     return;
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
   return(
     <Formik
       initialValues={{
       }}
       onSubmit={this.handleSubmit}
       render={props => {
          return(
             <Form>
               <Field
                name="school"
                label="School"
                options={this.props.schools}
                component={Select}
              />
              <Field
                required
                name="file"
                label="Choose file to upload"
                type="file"
                component={Input}
                onChange={(event) => {
                  props.setFieldValue("file", event.currentTarget.files[0]);
                }}
              />
              <div className="align-right">
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={util.isFormValid(props.errors, props.touched)}
                >
                  Upload
                </Button>
              </div>
             </Form>
          );
      }}
     />);
  }
}
AddUserForm.propTypes = {
  // auth: PropTypes.objectOf(PropTypes.string).isRequired,
  logOut: PropTypes.func.isRequired,
  enqueueSnackbar: PropTypes.func.isRequired,
};

export default compose(withSnackbar,firestoreConnect())(AddUserForm);
