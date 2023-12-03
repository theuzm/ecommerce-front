// Importando componentes e módulos necessários
import Center from "@/components/Center";
import Header from "@/components/Header";
import ProductBox from "@/components/ProductBox";
import { Category } from "@/models/Category";
import { Product } from "@/models/Product";
import Link from "next/link";
import styled from "styled-components";
import { RevealWrapper } from "next-reveal";
import { mongooseConnect } from "@/lib/mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import { WishedProduct } from "@/models/WishedProduct";

// Estilizando componentes usando styled-components
const CategoryGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    @media screen and (min-width: 768px){
        grid-template-columns: 1fr 1fr 1fr 1fr;
    }
`;

const CategoryTitle = styled.div`
    display: flex;
    margin-top: 10px;
    margin-bottom: 0;
    align-items: center;
    gap: 10px;
    h2{
        margin-bottom: 10px;
        margin-top: 10px;
    }
    a{
        color: #555;
        display: inline-block;
    }
`;

const CategoryWrapper = styled.div`
    margin-bottom: 40px;
`;

const ShowAllSquare = styled(Link)`
    background-color: #ddd;
    height: 160px;
    border-radius: 10px;
    align-items: center;
    display: flex;
    justify-content: center;
    color: #555;
    text-decoration: none;
`;

// Componente principal da página de categorias
export default function CategoriesPage({ mainCategories, categoriesProducts, wishedProducts = [] }) {
    return (
        <>
        {/* Componente do cabeçalho */}
        <Header />

        {/* Componente centralizado */}
        <Center>
            {/* Mapeando e exibindo cada categoria principal */}
            {mainCategories.map(cat => (
                <CategoryWrapper key={cat._id}>
                    {/* Título da categoria com link para "Mostrar mais" */}
                    <CategoryTitle>
                        <h2>{cat.name}</h2>
                        <div>
                            <Link href={'/category/'+cat._id}>Mostrar mais</Link>
                        </div>
                    </CategoryTitle>

                    {/* Grade de produtos da categoria */}
                    <CategoryGrid>
                        {categoriesProducts[cat._id].map((p, index) => (
                            // Wrapper para animação de revelação
                            <RevealWrapper key={index} delay={index*50}>
                                {/* Componente ProductBox para exibir informações do produto */}
                                <ProductBox {...p} wished={wishedProducts.includes(p._id)} />
                            </RevealWrapper>
                        ))}
                        
                        {/* Botão "Mostrar mais" que leva para a página da categoria */}
                        <RevealWrapper delay={categoriesProducts[cat._id].length*50}>
                            <ShowAllSquare href={'/category/'+cat._id}>
                                Mostrar mais &rarr;
                            </ShowAllSquare>
                        </RevealWrapper>
                    </CategoryGrid>
                </CategoryWrapper>
            ))}
        </Center>
        </>
    );
}

// Função para obter dados do servidor durante a renderização da página
export async function getServerSideProps(ctx) {
    try {
        // Conectando ao banco de dados MongoDB
        await mongooseConnect();
        
        // Buscando todas as categorias no banco de dados
        const categories = await Category.find();
        
        // Filtrando apenas as categorias principais (sem pai)
        const mainCategories = categories.filter(c => !c.parent);
        
        // Objeto para armazenar produtos associados a cada categoria
        const categoriesProducts = {};
        
        // Array para armazenar IDs de todos os produtos buscados
        const allFetchedProductsId = [];

        // Iterando sobre cada categoria principal
        for (const mainCat of mainCategories) {
            // Obtendo ID da categoria principal
            const mainCatId = mainCat._id.toString();
            
            // Obtendo IDs das categorias filhas
            const childCatIds = categories.filter(c => c?.parent?.toString() === mainCatId).map(c => c._id.toString());
            
            // Concatenando IDs das categorias principais e filhas
            const categoriesIds = [mainCatId, ...childCatIds];
            
            // Buscando até 3 produtos de cada categoria
            const products = await Product.find({category: categoriesIds}, null, {limit: 3, sort: {'_id': -1}});
            
            // Adicionando IDs dos produtos buscados ao array
            allFetchedProductsId.push(...products.map(p => p._id.toString()));

            // Armazenando produtos associados à categoria
            categoriesProducts[mainCat._id] = products;
        }

        // Obtendo a sessão do usuário autenticado usando NextAuth
        const session = await getServerSession(ctx.req, ctx.res, authOptions);
        
        // Buscando produtos desejados pelo usuário autenticado
        const wishedProducts = session?.user
            ? await WishedProduct.find({
                userEmail: session?.user.email,
                product: allFetchedProductsId,
            })
            : [];

        // Retornando os dados para serem passados como props para o componente
        return {
            props: {
                mainCategories: JSON.parse(JSON.stringify(mainCategories)),
                categoriesProducts: JSON.parse(JSON.stringify(categoriesProducts)),
                wishedProducts: wishedProducts.map(i => i.product.toString()),
            },
        };
    } catch (error) {
        // Tratamento de erro, caso ocorra algum problema na obtenção dos dados
        console.error(`Error in getServerSideProps: ${error.message}`);
        
        // Retorna um objeto vazio em caso de erro
        return { props: {} };
    }
}
