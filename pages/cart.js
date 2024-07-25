import { Header } from "@/components/Header";

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

export default function CartPage(){
    return(
        <>
        <Header/>
        <ColumnsWrapper>
        <Box>1</Box>
        <Box>2</Box>
        </ColumnsWrapper>
        </>
    );
}