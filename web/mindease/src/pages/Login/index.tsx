import IconBackground from '../../assets/background.png';
import { Link, Stack, Box } from '@mui/material';
import { LoginButton } from '../../components/buttons';
import { Link as RouterLink } from "react-router-dom";
import { EmailTextFieldInput, PasswordTextFieldInput } from '../../components/inputs';


export const Login = () => {

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

                <Stack direction="column">
                    <span className='bg-custom-slate font-bold text-2xl'>Bem-vindo!</span>
                    <span className='bg-custom-mist text-1xl'> Faça login para continuar</span> 
                </Stack>

                <EmailTextFieldInput label="E-mail" type="email" variant="outlined" required fullWidth />
                <PasswordTextFieldInput label="Senha" type="password" variant="outlined" required fullWidth />

                <Stack direction="row">
                    <LoginButton label='Entrar' variant="contained"  />
                </Stack>

                <Link component={RouterLink} to="/register" underline="hover" className="text-center">
                    <span className="text-gray-600">Ainda não tem uma conta? </span>
                    <span className="text-blue-500">Cadastre-se</span>
                </Link>

                </Box>
            </div>
        </div>
    )
}