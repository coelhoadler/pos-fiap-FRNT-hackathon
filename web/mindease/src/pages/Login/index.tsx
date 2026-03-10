import { useState } from 'react';
import IconBackground from '../../assets/background.png';
import { Link, Stack, Box, Alert } from '@mui/material';
import { LoginButton } from '../../components/buttons';
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { EmailTextFieldInput, PasswordTextFieldInput } from '../../components/inputs';
import { loginUser } from '../../api';


export const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        senha: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [field]: e.target.value
        }));
        if (error) setError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!formData.email.trim()) {
            setError('Por favor, informe seu e-mail');
            return;
        }

        if (!formData.senha) {
            setError('Por favor, informe sua senha');
            return;
        }

        setLoading(true);

        try {
            const result = await loginUser(formData);
            
            if (result.success) {
                navigate('/home');
            } else {
                setError(result.error || 'Erro ao fazer login');
            }
        } catch (err) {
            setError('Erro inesperado. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='flex flex-row w-screen h-screen m-0 bg-custom-sand'>
            <div className='w-[60vw] h-screen'>
                <img className='w-full h-full object-cover' src={IconBackground} alt="Background" />
            </div>

            <div className='w-[40vw] h-screen flex items-center justify-center'>
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    className='w-4/6 flex flex-col gap-4'
                >

                <Stack direction="column">
                    <span className='text-custom-slate font-bold text-2xl'>Bem-vindo!</span>
                    <span className='text-custom-mist text-xl'> Faça login para continuar</span> 
                </Stack>

                {error && (
                    <Alert severity="error" onClose={() => setError(null)}>
                        {error}
                    </Alert>
                )}

                <EmailTextFieldInput 
                    label="E-mail" 
                    type="email" 
                    variant="outlined" 
                    required 
                    fullWidth 
                    value={formData.email}
                    onChange={handleChange('email')}
                    disabled={loading}
                />
                <PasswordTextFieldInput 
                    label="Senha" 
                    type="password" 
                    variant="outlined" 
                    required 
                    fullWidth 
                    value={formData.senha}
                    onChange={handleChange('senha')}
                    disabled={loading}
                />

                <Stack direction="row">
                    <LoginButton 
                        label={loading ? 'Entrando...' : 'Entrar'} 
                        variant="contained"
                        type="submit"
                        disabled={loading}
                    />
                </Stack>

                <Link component={RouterLink} to="/register" underline="hover" className="text-center">
                    <span className="text-custom-mist">Ainda não tem uma conta? </span>
                    <span className="text-custom-slate font-semibold">Cadastre-se</span>
                </Link>

                </Box>
            </div>
        </div>
    )
}