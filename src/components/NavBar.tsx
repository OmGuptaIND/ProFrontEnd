import { Box, Button, Flex, Link } from '@chakra-ui/react';
import React from 'react';
import NextLink from 'next/link';
import { useLogoutMutation, useMeQuery } from '../generated/graphql';
import { isServer } from '../utils/isServer';
interface navabarprops { }

const NavBar: React.FC<navabarprops> = () => {
    const[{fetching:logoutFetching}, logout] = useLogoutMutation();
    const [{data, fetching}] = useMeQuery({
        pause: isServer(),
    });
    let body = null;
    if( !data?.me ){
        body = (
            <>
                <NextLink href = '/login' ><Link color = "white" mr = {2}>login</Link></NextLink>
                <NextLink href = '/register' ><Link color = "white" >Register</Link></NextLink>
            </>
        )
    }
    else {
        body = (
            <Flex>
                <Box mr = {4} >{data.me.username}</Box>
                <Button onSubmitting = {logoutFetching} onClick = {() => logout()} variant = "link">Logout</Button>
            </Flex>
        )
    }
    return (
        <Flex bg = 'tomato' p = {4}>
            <Box ml = {"auto"} >
                {body}
            </Box>
        </Flex>
    )
}

export default NavBar;