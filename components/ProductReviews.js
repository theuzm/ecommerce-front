import styled from "styled-components";
import WhiteBox from "./WhiteBox";
import StarsRating from "./StarsRating";

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
grid-template-columns: 1fr 1fr;
gap: 40px;
`;

export default function ProductReviews({product}) {
    return (
        <div>
            <title>Reviews</title>
            <ColsWrapper>
            <WhiteBox>
                <Subtitle>Add a Review</Subtitle>
                <div>
                    <StarsRating onChage={() => {}} />
                </div>
                <input placeholder="Title" />
            </WhiteBox>
            <div>
                <Subtitle>All Reviews</Subtitle>
            </div>
            </ColsWrapper>
        </div>
    );
}