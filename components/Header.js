import Link from "next/link";
import styled from "styled-components";
import Center from "./Center";
import { useContext } from "react";
import { CartContext } from "./CartContext";

const StyledHeader = styled.header`
    background-color: #222;
`;

const Logo = styled(Link)`
    color:#fff;
    text-decoration:none;
`;

const Wrapper = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 20px 0;
`;

const StyledNav = styled.nav`
    display: flex;
    gap: 15px;
`;

const NavLink = styled(Link)`
    color:#aaa;
    text-decoration:none;
`;


export default function Header() {
    const {cartProducts} = useContext(CartContext);
    return (
        <StyledHeader>
            <Center>
                <Wrapper>
                    <Logo href={'/'}>Ecommerce</Logo>
                    <StyledNav>
                        <NavLink href={'/'}>Início</NavLink>
                        <NavLink href={'/products'}>Todos os Produtos</NavLink>
                        <NavLink href={'/categories'}>Categorias</NavLink>
                        <NavLink href={'/account'}>Conta</NavLink>
                        <NavLink href={'/cart'}>Carrinho ({cartProducts.length})</NavLink>
                    </StyledNav>
                </Wrapper>
                
            </Center>
        </StyledHeader>
    );
}