import styled from "styled-components";
import WhiteBox from "./WhiteBox";
import StarsRating from "./StarsRating";
import Button from "./Button";
import { useEffect, useState } from "react";
import Textarea from "./Textarea";
import axios from "axios";
import Spinner from "./Spinner";

const Title = styled.h2`
font-size: 1.2rem;
margin-bottom: 5px;
`;

const Subtitle = styled.h3`
font-size: 1rem;
margin-top: 5px;
`;

const ColsWrapper = styled.div`
display: grid;
grid-template-columns: 1fr;
gap: 40px;
margin-bottom: 40px;
@media scream and (min-width: 768px){
    grid-template-columns: 1fr 1fr;
    gap: 40px;
}
`;
const ReviewWrapper = styled.div`
margin=bottom: 10px;
border-top: 1px solid #eee;
padding: 10px 0;
h3{
    margin: 3px 0;
    font-size: 1rem;
    color:#333;
    font-weight: normal;
}
p{
    margin: 0;
    font-size: .7rem;
    line-height: 1rem;
    color:#555;
}
`;
const ReviewHeader = styled.div`
    display: flex;
    justify-content: space-between;
        time{
        font-size: 12px;
        color: #aaa;
    }
`;

export default function ProductReviews({product}) {
    const [title,setTitle] = useState('');
    const [description,setDescription] = useState('');
    const [stars,setStars] = useState(0);
    const [reviews,setReviews] = useState([]);
    const [reviewsLoading,setReviewsLoading] = useState(false);
    function submitReview() {
    const data = {title,description,stars,product:product._id};
    axios.post('/api/reviews', data).then(res => {
        setTitle('');
        setDescription('');
        setStars(0);
        loadReviews();
    });
    }

    useEffect(() => {
        loadReviews();
    },[]);

    function loadReviews() {
        setReviewsLoading(true);
        axios.get('/api/reviews?product='+product._id).then(res => {
            setReviews(res.data);
            setReviewsLoading(false);
    });
    }
    return (
        <div>
            <title>Avaliação</title>
            <ColsWrapper>
        <div>
            <WhiteBox>
                <Subtitle>Adicionar avaliação</Subtitle>
                <div>
                    <StarsRating onChange={setStars} />
                </div>
                <input 
                value={title}
                onChange={ev => setTitle(ev.target.value)}
                placeholder="Titulo" />
                <Textarea 
                value={description}
                onChange={ev => setDescription(ev.target.value)}
                placeholder="O que vc achou?Pros?contras?" />
                <div>
                    <Button primary onClick={submitReview}>Envie sua avaliação</Button>
                </div>
            </WhiteBox>
        </div>
        <div>
        <WhiteBox>
                <Subtitle>Todas avaliações</Subtitle>
                {reviewsLoading && (
                    <Spinner fullWidth={true} />
                )}
                {reviews.length === 0 && (
                    <p>No reviews :</p>
                )}
                {reviews.length > 0 && reviews.map(review => (
                    <ReviewWrapper key={review._id}>
                        <ReviewHeader>
                        <StarsRating size={'sm'} disable={true} defaultHowMany={review.stars} />
                        <time>{(new Date(review.createdAt)).toLocaleString('sv-SE')}</time>
                        </ReviewHeader>
                        <h3>{review.title}</h3>
                        <p>{review.description}</p>
                    </ReviewWrapper>
                ))}
            </WhiteBox>
        </div>
            </ColsWrapper>
        </div>
    );
}