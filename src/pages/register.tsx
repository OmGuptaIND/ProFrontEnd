import React from 'react';

import {Formik, Form} from 'formik';
import { Box, Button, FormControl, FormLabel, Input } from '@chakra-ui/react';
import Wrapper from '../components/Wrapper';
import InputField from '../components/InputField';
import { useRegisterMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';
import { useRouter } from 'next/router';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../utils/createUrqlClient';

interface registerProps{

}

const Register: React.FC<registerProps> = ({}) => {
    const [,register] = useRegisterMutation();
    const router = useRouter();
    return(
        <Wrapper variant = 'small' >
            <Formik initialValues = {{email:"", username: "", password: ""}} onSubmit={async (values, {setErrors}) => {
                const response = await register({username: values.username, password: values.password, email:values.email});
                if( response.data?.register.errors ) setErrors(toErrorMap(response.data.register.errors));
                else if ( response.data?.register.user) router.push('/');
            }} >
                {({isSubmitting})=> (
                    <Form>
                        <InputField type = 'text' placeholder = 'email' name = 'email' label = 'email' />
                        <Box mt = {4} >
                            <InputField autoComplete='off' name = 'username' placeholder = 'username' label = 'username' />
                        </Box>
                        <Box mt = {4} >
                            <InputField type = 'password' placeholder = 'password' name = 'password' label = 'Password' />
                        </Box>
                        <Button colorScheme="teal" mt = {4} type = 'submit' isLoading = {isSubmitting}>Register</Button>
                    </Form>
                )}
            </Formik>
        </Wrapper>
    )
};

export default withUrqlClient(createUrqlClient)(Register);