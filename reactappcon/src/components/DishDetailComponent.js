import React from 'react';
import { Card,CardImg, CardImgOverlay, CardText,  CardBody, CardTitle } from 'reactstrap';

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
            return (selectedDishComments);
        }
        else {
            return <div></div>
        }

    }

    const DishDetails = (props) => {
        if (props.selectedDish != null){
            return (
                <div className="container">
                    <div className="row">
                        <div className= "col-12 col-md-5 mt-1">
                            <RenderDish selectedDish = {props.selectedDish}/>
                        </div>
                        <div className="col-12 col-md-5 mt-1">
                            <h4>Comments</h4>
                            <RenderComments comments = {props.selectedDish.comments}/>
                        </div>
                    </div>
                </div>

    
            )
        }
        else {
            return <div></div>
        }
    }


export default DishDetails;