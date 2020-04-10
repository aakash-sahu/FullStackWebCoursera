// Presentation component
import React from 'react';
// import { Media } from 'reactstrap';
import { Card,CardImg, CardImgOverlay, CardText,  CardBody, CardTitle, Breadcrumb, BreadcrumbItem } from 'reactstrap';
import { Link } from 'react-router-dom';

        function RenderMenuItem ({dish, onClick}) {
            console.log(`/menu/${dish.id}`)
            return (
                <Card> 
                    <Link to= {`/menu/${dish.id}`} >
                        <CardImg width="100%" src={dish.image} alt= {dish.name}/>
                        <CardImgOverlay>
                            <CardTitle>{dish.name}</CardTitle>
                        </CardImgOverlay>
                    </Link>
                    
            </Card>
            )
        }

  
        const Menu = (props) => {
            const menu = props.dishes.map((dish)=>{
            return (
                <div key={dish.id} className= "col-12 col-md-5 mt-1">
                    <RenderMenuItem dish = {dish}/>
                </div>
            );
            });
            return (
                <div className="container">
                    <div className="row">
                        <Breadcrumb>
                            <BreadcrumbItem><Link to='/home'>Home</Link></BreadcrumbItem>
                            <BreadcrumbItem active>Menu</BreadcrumbItem>
                        </Breadcrumb>
                    </div>
                    <div className="col-12">
                        <h3>Menu</h3>
                        <hr />
                        <div className="row">
                            {menu}
                        </div>

                    </div>
                    
                </div>
            );
        }

export default Menu;