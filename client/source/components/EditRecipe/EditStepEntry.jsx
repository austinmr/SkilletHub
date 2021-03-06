import React from 'react';

//Bootstrap 
import { Grid, Row, Col, Form, FormGroup, FormControl, Button, Container, ControlLabel, DropdownButton, MenuItem } from 'react-bootstrap';

const timesRegEx = [/\d+\s?sec/, /\d+\s?min/, /\d+\s?hr/, /\d+\s?hour/]; 

class EditStepEntry extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      changed: false,
      disabled: true, 
      description: null,
      lines: null,
      ingredients: null,
      parsedIngredients: null, 
      availableIngredients: null, 
      time: null,
      display: '',
      validation: ''
    }; 
  }

  componentWillMount(){
    // console.log('MOUNTING EDIT STEP ENTRY!'); 
    var lines = Math.ceil(this.props.step.description.length / 100) * 30; 
    // console.log(lines); 
    this.setState({
      description: this.props.step.description,
      lines: lines,
      ingredients: this.props.step.ingredients,
      parsedIngredients: this.props.step.ingredients, 
      availableIngredients: this.props.availableIngredients, 
      deletedIngredients: this.props.deletedIngredients, 
      time: this.props.step.time,
      position: this.props.step.position,
      index: this.props.index
    }); 
  }

  componentWillReceiveProps(nextProps) {
    var invalidSteps = nextProps.invalidSteps; 
    if (invalidSteps.indexOf(this.state.index) !== -1) {
      this.setState({validation: 'error'}); 
    }
  }

  handleClick (event) {
    event.preventDefault(); 
    this.setState({
      changed: true, 
      disabled: false
    }); 
  }

  handleDelete (event) {
    event.preventDefault(); 
    var step = this.state; 
    this.props.handleDeleteStep(step); 
    this.setState({display: 'none'}); 

    // console.log('Attempting to delete step!'); 
    // console.log(this.state.description); 
    // console.log(step); 
    // console.log(typeof this.props.handleDeleteStep);
  }

  handleEdit (event) {
    event.preventDefault(); 
    var step = this.state; 
    this.props.handleEditStep(step); 
    this.setState({disabled: true}); 
    
    // console.log('Attempting to edit step!'); 
    // console.log(step); 
    // console.log(typeof this.props.handleEditStep);
  }



  timeParse (string) {
    var match = []; 
    timesRegEx.forEach((timeRegEx) => {
      var time = timeRegEx.exec(string); 
      if (time) {
        // console.log(time); 
        match.push(time); 
      } 
    });
    return match; 
  }


  handleChange (event) {
    var inputType = event.target.id; 
    if (inputType === 'description') {
      var description = event.target.value; 

      // Set height of the text box based on string length 
      var lines = Math.ceil(description.length / 100) * 30; 

      // Parse for ingredients 
      var availableIngredients = this.props.availableIngredients; 
      var deletedIngredients = this.props.deletedIngredients
      var parsedIngredients = this.state.parsedIngredients;

      availableIngredients.forEach((ingredient) => {
        var regEx = RegExp(ingredient, 'i');
        var parsedIngredient = regEx.exec(description); 
        if (parsedIngredient && parsedIngredients.indexOf(parsedIngredient[0]) === -1) {
          parsedIngredients.push(parsedIngredient[0])
        }
      });

      // console.log('DELETED INGREDIENTS'); 
      // console.log(deletedIngredients); 
      // console.log('BEFORE DELETING Ingredients'); 
      // console.log(parsedIngredients); 
      deletedIngredients.forEach((ingredient) => {
        var regEx = RegExp(ingredient, 'i');
        var deletedCheck = regEx.exec(description); 
        // console.log('DELETED CHECK'); 
        // console.log(deletedCheck); 
        if (!deletedCheck) {
          var index = parsedIngredients.indexOf(ingredient); 
          if (index !== -1) {
            parsedIngredients.splice(index, 1); 
          }
        }
      }); 

      // console.log('AFTER DELETING Ingredients'); 
      // console.log(parsedIngredients); 

      // Parse for time 
      var time = this.timeParse(description); 
      var stepTime = this.state.time; 
      if (time && !stepTime) {
        // console.log('SETTING TIME: ', time); 
        // console.log('TIME[0]: ', time[0]); 
        time = time[0];
        time = time[0].split(' ');
        // console.log(time); 
        this.setState({
          time: time[0],
          changed: true, 
          description: description,
          line: lines,
          parsedIngredients: parsedIngredients,
          ingredients: parsedIngredients
        }); 
      } else {
        this.setState({
          changed: true, 
          description: description,
          line: lines,
          parsedIngredients: parsedIngredients,
          ingredients: parsedIngredients
        }); 
      }
    }
  }

  _renderTime(){
    if (this.props.step.time) {
      return (
        <Col xs={4} md={4} style={{margin: 5}}>
          <h4> Time: {this.state.time} minutes </h4>
        </Col>
      )
    }
  }

  render() {
    return (
      <Grid style={{display: this.state.display}}>
        <Row> 
          <Col xs={8} md={8} style={{margin: 5}}>
            <FormGroup validationState={this.state.validation}>
              <ControlLabel> Step Description </ControlLabel>
              <FormControl componentClass="textarea" type="text" style={{height: this.state.lines}} id="description" value={this.state.description} onChange={this.handleChange.bind(this)} disabled={this.state.disabled}/>
            </FormGroup>
          </Col>
          <Button type="submit" style={{marginTop: 30, padding: 10}} onClick={this.handleClick.bind(this)}>
            Edit
          </Button>
          <Button type="submit" style={{marginTop: 30, padding: 10}} onClick={this.handleEdit.bind(this)} disabled={this.state.disabled}>
            Commit Edit
          </Button>
          <Button type="submit" style={{marginTop: 30, padding: 10}} onClick={this.handleDelete.bind(this)} disabled={this.state.disabled}>
            Delete
          </Button>
        </Row>
        <Row> 
          <Col xs={4} md={4} style={{margin: 5}}>
            <h4> Ingredients: {this.state.ingredients.join(', ')} </h4>
          </Col>
          {this._renderTime()}
        </Row>
      </Grid>
    )
  }
}

export default EditStepEntry;
