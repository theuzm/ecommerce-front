// Importando componentes e módulos necessários
import Button from "@/components/Button";
import { CartContext } from "@/components/CartContext";
import Center from "@/components/Center";
import Header from "@/components/Header";
import Input from "@/components/Input";
import Table from "@/components/Table";
import axios from "axios";
import { useSession } from "next-auth/react";
import { RevealWrapper } from "next-reveal";
import { useContext, useEffect, useState } from "react";
import styled from "styled-components";

// Estilizando componentes usando styled-components
const ColumnsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  @media screen and (min-width: 768px) {
    grid-template-columns: 1.2fr .8fr;
  }
  gap: 40px;
  margin-top: 40px;
`;

const Box = styled.div`
  background-color: #fff;
  border-radius: 10px;
  padding: 30px;
`;

const ProductInfoCell = styled.td`
  padding: 10px 0;
`;

const ProductImageBox = styled.div`
  width: 70px;
  height: 100px;
  padding: 2px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  display:flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  img{
    max-width: 60px;
    max-height: 60px;
  }
  @media screen and (min-width: 768px) {
    padding: 10px;
    width: 100px;
    height: 100px;
    img{
      max-width: 80px;
      max-height: 80px;
    }
  }
`;

const QuantityLabel = styled.span`
  padding: 0 15px;
  display: block;
  @media screen and (min-width: 768px) {
    display: inline-block;
    padding: 0 10px;
  }
`;

const CityHolder = styled.div`
  display:flex;
  gap: 5px;
`;

// Componente principal da página do carrinho
export default function CartPage() {
  // Utilizando o contexto do carrinho
  const { cartProducts, addProduct, removeProduct, clearCart } = useContext(CartContext);
  
  // Utilizando o hook useSession do NextAuth para obter informações da sessão do usuário
  const { data: session } = useSession();
  
  // Estados para armazenar informações do usuário e do carrinho
  const [products, setProducts] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [country, setCountry] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [shippingFee, setShippingFee] = useState(null);
  
  // Efeito para carregar os produtos do carrinho quando o carrinho é alterado
  useEffect(() => {
    if (cartProducts?.length >= 0) {
      axios.post('/api/cart', { ids: cartProducts })
        .then(response => {
          console.log('Produtos do carrinho:', response.data);
          setProducts(response.data);
        })
        .catch(error => {
          console.error('Erro ao carregar produtos do carrinho:', error);
        });
    } else {
      setProducts([]);
    }
  }, [cartProducts]);
  
  // Efeito para verificar se a compra foi bem-sucedida e limpar o carrinho
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    if (window?.location.href.includes('success')) {
      setIsSuccess(true);
      clearCart();
    }
  }, []);
  
  // Efeito para carregar informações do usuário autenticado
  useEffect(() => {
    if (!session) {
      return;
    }
    axios.get('/api/address').then(response => {
      setName(response.data?.name);
      setEmail(response.data?.email);
      setCity(response.data?.city);
      setPostalCode(response.data?.postalCode);
      setStreetAddress(response.data?.streetAddress);
      setCountry(response.data?.country);
    });
  }, [session]);

  // Função para aumentar a quantidade de um produto no carrinho
  function moreOfThisProduct(id) {
    addProduct(id);
  }

  // Função para diminuir a quantidade de um produto no carrinho
  function lessOfThisProduct(id) {
    removeProduct(id);
  }
  
  // Função para prosseguir para o pagamento
  async function goToPayment() {
    const response = await axios.post('/api/checkout', {
      name, email, city, postalCode, streetAddress, country,
      cartProducts,
    });
    if (response.data.url) {
      window.location = response.data.url;
      clearCart();
    }
  }

  // Calculando o total dos produtos no carrinho
  let updatedCartProducts = Array.isArray(cartProducts) ? cartProducts : [];
  let productsTotal = 0;
  for (const productId of updatedCartProducts) {
    const price = products.find((p) => p._id === productId)?.price || 0;
    productsTotal += price;
  }

  // Renderização condicional em caso de sucesso na compra
  if (isSuccess) {
    return (
      <>
        <Header />
        <Center>
          <ColumnsWrapper>
            <Box>
              <h1>Agradecemos pela sua compra!</h1>
              <p>Enviaremos um email quando seu pedido sair para entrega.</p>
            </Box>
          </ColumnsWrapper>
        </Center>
      </>
    );
  }

  // Renderização padrão da página do carrinho
  return (
    <>
      <Header />
      <Center>
        <ColumnsWrapper>
          {/* Seção de exibição do carrinho */}
          <RevealWrapper delay={0}>
            <Box>
              <h2>Carrinho</h2>
              {!cartProducts?.length && <div>Seu carrinho está vazio</div>}
              {products?.length > 0 && (
                <Table>
                  <thead>
                    <tr>
                      <th>Produto</th>
                      <th>Quantidade</th>
                      <th>Preço</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products
                      .filter((product) => cartProducts.includes(product._id))
                      .map((product) => (
                        <tr key={product._id}>
                          {/* Informações do produto */}
                          <ProductInfoCell>
                            {/* Caixa de imagem do produto */}
                            <ProductImageBox>
                              <img src={product.images[0]} alt="" />
                            </ProductImageBox>
                            {product.title}
                          </ProductInfoCell>
                          {/* Controles de quantidade do produto */}
                          <td>
                            <Button onClick={() => lessOfThisProduct(product._id)}>
                              -
                            </Button>
                            <QuantityLabel>
                              {
                                cartProducts.filter((id) => id === product._id)
                                  .length
                              }
                            </QuantityLabel>
                            <Button onClick={() => moreOfThisProduct(product._id)}>
                              +
                            </Button>
                          </td>
                          {/* Preço total do produto no carrinho */}
                          <td>
                            R$
                            {cartProducts.filter((id) => id === product._id)
                              .length * product.price}
                          </td>
                        </tr>
                      ))}
                    {/* Total geral dos produtos no carrinho */}
                    <tr>
                      <td></td>
                      <td></td>
                      <td>R${productsTotal}</td>
                    </tr>
                  </tbody>
                </Table>
              )}
            </Box>
          </RevealWrapper>
          
          {/* Seção de informações da compra */}
          {!!cartProducts?.length && (
            <RevealWrapper delay={100}>
              <Box>
                <h2>Informações da Compra</h2>
                {/* Campos de informações do usuário */}
                <Input
                  type="text"
                  placeholder="Nome"
                  value={name}
                  name="name"
                  onChange={(ev) => setName(ev.target.value)}
                />
                <Input
                  type="text"
                  placeholder="Email"
                  value={email}
                  name="email"
                  onChange={(ev) => setEmail(ev.target.value)}
                />
                {/* Campos de endereço do usuário */}
                <CityHolder>
                  <Input
                    type="text"
                    placeholder="Cidade"
                    value={city}
                    name="city"
                    onChange={(ev) => setCity(ev.target.value)}
                  />
                  <Input
                    type="text"
                    placeholder="CEP"
                    value={postalCode}
                    name="postalCode"
                    onChange={(ev) => setPostalCode(ev.target.value)}
                  />
                </CityHolder>
                <Input
                  type="text"
                  placeholder="Endereço"
                  value={streetAddress}
                  name="streetAddress"
                  onChange={(ev) => setStreetAddress(ev.target.value)}
                />
                <Input
                  type="text"
                  placeholder="País"
                  value={country}
                  name="country"
                  onChange={(ev) => setCountry(ev.target.value)}
                />
                {/* Botão para prosseguir para o pagamento */}
                <Button black block onClick={goToPayment}>
                  Continuar para o pagamento
                </Button>
              </Box>
            </RevealWrapper>
          )}
        </ColumnsWrapper>
      </Center>
    </>
  );
}
