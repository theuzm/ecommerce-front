import Header from "@/components/Header";
import Title from "@/components/Title";
import Center from "@/components/Center";
import { signIn, signOut, useSession } from "next-auth/react";
import Button from "@/components/Button";
import styled from "styled-components";
import WhiteBox from "@/components/WhiteBox";
import { RevealWrapper } from "next-reveal";
import Input from "@/components/Input";
import { useEffect, useState } from "react";
import axios from "axios";
import Spinner from "@/components/Spinner";
import ProductBox from "@/components/ProductBox";
import Tabs from "@/components/Tabs";
import SingleOrder from "@/components/SingleOrder";

// Estilos estilizados para o componente
const ColsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 40px;
  margin: 40px 0;
  p {
    margin: 5px;
  }
`;

const CityHolder = styled.div`
  display: flex;
  gap: 5px;
`;

const WishedProductsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
`;

// Componente principal AccountPage
export default function AccountPage() {
  // Obtendo dados da sessão
  const { data: session } = useSession();

  // Estados para armazenar informações da conta
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [country, setCountry] = useState('');

  // Estados para controle de carregamento de dados
  const [addressLoaded, setAddressLoaded] = useState(true);
  const [wishlistLoaded, setWishlistLoaded] = useState(true);
  const [orderLoaded, setOrderLoaded] = useState(true);

  // Estados para armazenar produtos desejados e pedidos
  const [wishedProducts, setWishedProducts] = useState([]);
  const [activeTab, setActiveTab] = useState('Pedidos');
  const [orders, setOrders] = useState([]);

  // Função para fazer logout
  async function logout() {
    await signOut({
      callbackUrl: process.env.NEXT_PUBLIC_URL,
    });
  }

  // Função para fazer login
  async function login() {
    await signIn('google');
  }

  // Função para salvar informações da conta
  function saveAddress() {
    const data = { name, email, city, streetAddress, postalCode, country };
    axios.put('/api/address', data);
  }

  // Efeito colateral para carregar dados da conta, lista de desejos e pedidos
  useEffect(() => {
    if (!session) {
      return;
    }

    setAddressLoaded(false);
    setWishlistLoaded(false);
    setOrderLoaded(false);

    // Carregar informações da conta
    axios.get('/api/address').then(response => {
      setName(response.data?.name);
      setEmail(response.data?.email);
      setCity(response.data?.city);
      setPostalCode(response.data?.postalCode);
      setStreetAddress(response.data?.streetAddress);
      setCountry(response.data?.country);
      setAddressLoaded(true);
    });

    // Carregar lista de desejos
    axios.get('/api/wishlist').then(response => {
      setWishedProducts(response.data.map(wp => wp.product));
      setWishlistLoaded(true);
    });

    // Carregar pedidos
    axios.get('/api/orders').then(response => {
      setOrders(response.data);
      setOrderLoaded(true);
    });
  }, [session]);

  // Função chamada quando um produto é removido da lista de desejos
  function productRemovedFromWishlist(idToRemove) {
    setWishedProducts(products => {
      return products.filter(productId => productId !== idToRemove);
    });
  }

  return (
    <>
      <Header />
      <Center>
        <ColsWrapper>
          {/* Seção de Pedidos e Lista de Desejos */}
          <div>
            <RevealWrapper delay={0}>
              <WhiteBox>
                {/* Abas para selecionar entre Pedidos e Lista de Desejos */}
                <Tabs
                  tabs={['Pedidos', 'Lista de desejos']}
                  active={activeTab}
                  onChange={setActiveTab}
                />

                {/* Conteúdo da aba de Pedidos */}
                {activeTab === 'Pedidos' && (
                  <>
                    {!orderLoaded && (
                      <Spinner fullWidth={true} />
                    )}
                    {orderLoaded && (
                      <div>
                        {orders.length === 0 && (
                          <p>Faça login para ver seus pedidos</p>
                        )}
                        {orders.length > 0 && orders.map(o => (
                          <SingleOrder key={o._id} {...o} />
                        ))}
                      </div>
                    )}
                  </>
                )}

                {/* Conteúdo da aba de Lista de Desejos */}
                {activeTab === 'Lista de desejos' && (
                  <>
                    {!wishlistLoaded && (
                      <Spinner fullWidth={true} />
                    )}
                    {wishlistLoaded && (
                      <>
                        <WishedProductsGrid>
                          {wishedProducts.length > 0 && wishedProducts.map(wp => (
                            <ProductBox
                              key={wp._id}
                              {...wp}
                              wished={true}
                              onRemoveFromWishlist={productRemovedFromWishlist}
                            />
                          ))}
                        </WishedProductsGrid>
                        {wishedProducts.length === 0 && (
                          <>
                            {session && (
                              <p>Lista Vazia</p>
                            )}
                            {!session && (
                              <p>Logar para adicionar os produtos a sua lista</p>
                            )}
                          </>
                        )}
                      </>
                    )}
                  </>
                )}
              </WhiteBox>
            </RevealWrapper>
          </div>

          {/* Seção de Detalhes da Conta e Login */}
          <div>
            <RevealWrapper delay={100}>
              <WhiteBox>
                <h2>{session ? 'Detalhes da Conta' : 'Login'}</h2>
                {/* Spinner de carregamento enquanto os dados da conta estão sendo carregados */}
                {!addressLoaded && (
                  <Spinner fullWidth={true} />
                )}

                {/* Conteúdo dos detalhes da conta */}
                {addressLoaded && session && (
                  <>
                    <Input
                      type="text"
                      placeholder="Nome"
                      value={name}
                      name="name"
                      onChange={ev => setName(ev.target.value)}
                    />
                    <Input
                      type="text"
                      placeholder="E-mail"
                      value={email}
                      name="email"
                      onChange={ev => setEmail(ev.target.value)}
                    />
                    <CityHolder>
                      <Input
                        type="text"
                        placeholder="Cidade"
                        value={city}
                        name="city"
                        onChange={ev => setCity(ev.target.value)}
                      />
                      <Input
                        type="text"
                        placeholder="CEP"
                        value={postalCode}
                        name="postalCode"
                        onChange={ev => setPostalCode(ev.target.value)}
                      />
                    </CityHolder>
                    <Input
                      type="text"
                      placeholder="Endereço"
                      value={streetAddress}
                      name="streetAddress"
                      onChange={ev => setStreetAddress(ev.target.value)}
                    />
                    <Input
                      type="text"
                      placeholder="Pais"
                      value={country}
                      name="country"
                      onChange={ev => setCountry(ev.target.value)}
                    />
                    <Button black block onClick={saveAddress}>
                      Save
                    </Button>
                    <hr />
                  </>
                )}

                {/* Botão de logout ou login, dependendo do estado da sessão */}
                {session && (
                  <Button primary onClick={logout}>
                    Sair
                  </Button>
                )}
                {!session && (
                  <Button primary onClick={login}>
                    Logar com o Google
                  </Button>
                )}
              </WhiteBox>
            </RevealWrapper>
          </div>
        </ColsWrapper>
      </Center>
    </>
  );
}
