import { useState } from 'react';
import IconBackground from '../../assets/background.png';
import { Link, Stack, Box, Alert } from '@mui/material';
import { SaveButton } from '../../components/buttons';

import { EmailTextFieldInput } from '../../components/inputs/EmailTextFieldInput';
import { PasswordTextFieldInput } from '../../components/inputs/PasswordTextFieldInput';
import { TextFieldInput } from '../../components/inputs';
import { Link as RouterLink, useNavigate } from "react-router-dom";
import IMGLogo from '../../assets/logo.png';
import { registerUser } from '../../api';


export const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        senha: '',
        confirmarSenha: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

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
        setSuccess(false);

        // Validações básicas
        if (!formData.nome.trim()) {
            setError('Por favor, informe seu nome');
            return;
        }

        if (!formData.email.trim()) {
            setError('Por favor, informe seu e-mail');
            return;
        }

        if (!formData.senha) {
            setError('Por favor, informe sua senha');
            return;
        }

        if (formData.senha !== formData.confirmarSenha) {
            setError('As senhas não coincidem');
            return;
        }

        setLoading(true);

        try {
            const result = await registerUser(formData);
            
            if (result.success) {
                setSuccess(true);
                // Redirecionar para login após 2 segundos
                setTimeout(() => {
                    navigate('/');
                }, 2000);
            } else {
                setError(result.error || 'Erro ao criar conta');
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

                <Stack  className='flex justify-center' direction="row">
                    <img src={IMGLogo} alt="Logo" />
                </Stack>

                <Stack direction="row" className='justify-center'>
                    <h1 className='text-3xl font-semibold text-gray-700'>Crie sua conta</h1>
                </Stack>

                {error && (
                    <Alert severity="error" onClose={() => setError(null)}>
                        {error}
                    </Alert>
                )}

                {success && (
                    <Alert severity="success">
                        Conta criada com sucesso! Redirecionando...
                    </Alert>
                )}

                <TextFieldInput 
                    label="Nome" 
                    type="text" 
                    variant="outlined" 
                    required 
                    fullWidth 
                    value={formData.nome}
                    onChange={handleChange('nome')}
                    disabled={loading}
                />
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
                <PasswordTextFieldInput 
                    label="Confirme sua senha" 
                    type="password" 
                    variant="outlined" 
                    required 
                    fullWidth 
                    value={formData.confirmarSenha}
                    onChange={handleChange('confirmarSenha')}
                    disabled={loading}
                />

                <Stack direction="row">
                    <SaveButton 
                        label={loading ? 'Salvando...' : 'Salvar'} 
                        variant="contained"
                        type="submit"
                        disabled={loading || success}
                    />
                </Stack>


                <Link component={RouterLink} to="/" underline="hover" className="text-center">
                    <span className="text-gray-600">{'<<< Voltar'}</span>
                </Link>
                </Box>
            </div>
        </div>
    )
}