import Header from "@/components/Header";
import Center from "@/components/Center";
import Title from "@/components/Title";
import { useSession } from "next-auth/react";


export default function AccountPage(){
   const session = useSession();
    return(
        <>
        <Header>
        <Center>
            <Title>Account</Title>
        </Center>

        </Header>
        </>
    );
}