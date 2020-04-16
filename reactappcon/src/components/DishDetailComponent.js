import React, { Component } from 'react';
import { Card,CardImg, CardImgOverlay, CardText,  CardBody, CardTitle, BreadcrumbItem, Breadcrumb, Button,
        Modal, ModalBody, ModalHeader, Row, Col, Label } from 'reactstrap';
import { Link } from 'react-router-dom';
import { Control, LocalForm, Errors } from 'react-redux-form';

const maxLength = (len) => (val) => !(val) || (val.length <= len) ;
const minLength = (len) => (val) => (val) && (val.length >= len);

class CommentForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isAddCommentOpen: false
        };
        this.toggleAddCommentModal = this.toggleAddCommentModal.bind(this);
        this.toggleAddCommentModal = this.toggleAddCommentModal.bind(this);
    }

    toggleAddCommentModal() {
        this.setState({
            isAddCommentOpen: !this.state.isAddCommentOpen
        })
    }

    handleSubmitAddComment(values){
        this.toggleAddCommentModal();
        alert("Current state is: "+ JSON.stringify(values));
    }

    render() {
        return (
            <React.Fragment>
                <Button outline onClick={this.toggleAddCommentModal}><span className="fa fa-pencil fa-lg"></span>{" "} 
                Submit Comment</Button>
                <Modal isOpen ={this.state.isAddCommentOpen} toggle={this.toggleAddCommentModal}>
                    <ModalHeader toggle={this.toggleAddCommentModal}>Submit Comment</ModalHeader>
                    <ModalBody>
                        <div className="container">
                            <LocalForm onSubmit={(values)=> this.handleSubmitAddComment(values)}>
                                <Row className="form-group">
                                    <Label htmlFor="rating">Rating</Label>
                                    <Control.select model=".rating" name="rating" className="form-control">
                                        <option>1</option>
                                        <option>2</option>
                                        <option>3</option>
                                        <option>4</option>
                                        <option>5</option>
                                    </Control.select>
                                </Row>
                                <Row className="form-group">
                                    <Label htmlFor="name">Your Name</Label>
                                    <Control.text model=".name" id = "name" name="name"
                                     className = "form-control"
                                     placeholder="Your Name"
                                     validators = {{
                                         minLength: minLength(3), maxLength:maxLength(15)
                                     }} />
                                     <Errors
                                     className="text-danger"
                                     model=".name"
                                     show="touched"
                                     messages={{
                                         minLength: "Must be greater than 3 characters",
                                         maxLength: "Must be 15 characters or less"
                                     }} />
                                </Row>
                                <Row className="form-group">
                                    <Label htmlFor="comment">Comment</Label>
                                    <Control.textarea model=".comment" id = "comment" name="comment"
                                     className = "form-control" 
                                     rows="6"/>
                                </Row>
                                <Row className="form-group">
                                    <Button type="submit" value="submit" color="primary">Submit</Button>
                                    <Button onClick={this.toggleAddCommentModal} color="primary" className="ml-1">Cancel</Button>
                                </Row>
                            </LocalForm>
                        </div>

                    </ModalBody>
                </Modal>
            </React.Fragment>
        )
    }
}

    
    function RenderDish({selectedDish}){
        return (
            <Card>
                <CardImg src={selectedDish.image} alt={selectedDish.name}/>
                <CardBody>
                    <CardTitle>{selectedDish.name}</CardTitle>
                    <CardText>{selectedDish.description}</CardText>
                </CardBody>
            </Card>
        );
    }

    function RenderComments({comments}){
        const selectedDishComments = comments.map((comment)=> {
            return (
                <ul key = {Comment.id} className='list-unstyled m-1'>
                    <li>{comment.comment}</li>
                    <li className="mb-1 text-muted">-- {comment.author}, {new Intl.DateTimeFormat('en-US', {year: 'numeric', month: 'short', day:'2-digit'}).format(new Date(Date.parse(comment.date)))}</li>
                </ul>
            )
        })
        if (selectedDishComments != null) {
            return (
                <div>
                    {selectedDishComments}
                    <CommentForm />
                </div>
                );
        }
        else {
            return <div></div>
        }

    }

    const DishDetail = (props) => {
        console.log(props.dish)
        if (props.selectedDish != null){
            return (
                <div className="container">
                    <div className="row">
                        <Breadcrumb>
                            <BreadcrumbItem><Link to='/menu'>Menu</Link></BreadcrumbItem>
                            <BreadcrumbItem active>{props.selectedDish.name}</BreadcrumbItem>
                        </Breadcrumb>
                    </div>
                    <div className="col-12">
                        <h3>{props.selectedDish.name}</h3>
                        <hr />
                    </div>
                    <div className="row">
                        <div className= "col-12 col-md-5 mt-1">
                            <RenderDish selectedDish = {props.selectedDish} />
                        </div>
                        <div className="col-12 col-md-5 mt-1">
                            <h4>Comments</h4>
                            <RenderComments comments = {props.comments} />
                        </div>
                    </div>
                </div>

    
            )
        }
        else {
            return <div>wrongone</div>
        }
    }


export default DishDetail;