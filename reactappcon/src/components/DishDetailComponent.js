import React, { Component } from 'react';
import { Card,CardImg, CardImgOverlay, CardText,  CardBody, CardTitle } from 'reactstrap';

class DishDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }
    renderDish(selectedDish){
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

    renderComments(comments){
        const selectedDishComments = comments.map((comment)=> {
            return (
                <div key = {Comment.id} className='list-unstyled m-2'>
                    <li className= "mb-1">{comment.comment}</li>
                    <li className="mb-1 text-muted">-- {comment.author}, {Date(comment.date)}</li>
                </div>
            )
        })
        if (selectedDishComments != null) {
            return (selectedDishComments);
        }
        else {
            return <div></div>
        }

    }

    render(){
        if (this.props.selectedDish != null){
            return (
                <div className="row">
                    <div className= "col-12 col-md-5 mt-1">
                        {this.renderDish(this.props.selectedDish)}
                    </div>
                    <div className="col-12 col-md-5 mt-1">
                        <div>
                            <h4>Comments</h4>
                            {this.renderComments(this.props.selectedDish['comments'])}
                        </div>
                    </div>
                </div>
    
            )
        }
        else {
            return <div></div>
        }

    }
}

export default DishDetails;