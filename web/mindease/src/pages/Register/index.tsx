import IconBackground from '../../assets/background.png';
import { Link, Stack, Box } from '@mui/material';
import { SaveButton } from '../../components/buttons';

import { EmailTextFieldInput } from '../../components/inputs/EmailTextFieldInput';
import { PasswordTextFieldInput } from '../../components/inputs/PasswordTextFieldInput';
import { TextFieldInput } from '../../components/inputs';
import { Link as RouterLink } from "react-router-dom";


export const Register = () => {
    return (
        <div className='flex flex-row w-screen h-screen m-0 bg-custom-sand'>
            <div className='w-[60vw] h-screen'>
                <img className='w-full h-full object-cover' src={IconBackground} alt="Background" />
            </div>

            <div className='w-[40vw] h-screen flex items-center justify-center'>
                <Box
                    component="form"
                    onSubmit={(e) => {
                        e.preventDefault();
                        console.log('Login submit');
                    }}
                    className='w-4/6 flex flex-col gap-4'
                >

                
                <TextFieldInput label="Nome" type="text" variant="outlined" required fullWidth />
                <EmailTextFieldInput label="E-mail" type="email" variant="outlined" required fullWidth />
                <PasswordTextFieldInput label="Senha" type="password" variant="outlined" required fullWidth />
                <PasswordTextFieldInput label="Confirme sua senha" type="password" variant="outlined" required fullWidth />

                <Stack direction="row">
                    <SaveButton label='Salvar' variant="contained"  />
                </Stack>


                <Link component={RouterLink} to="/" underline="hover" className="text-center">
                    <span className="text-gray-600">{'<<< Voltar'}</span>
                </Link>
                </Box>
            </div>
        </div>
    )
}