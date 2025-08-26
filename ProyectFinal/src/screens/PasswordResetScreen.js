import React, { useState } from 'react';
import { View, Text, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Container, CustomInput, CustomButton } from '../components/ui';
import { validateEmail, validationMessages } from '../utils/validation';
import { passwordResetStyles } from './PasswordResetScreen.styles';

export const PasswordResetScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const validateForm = () => {
    let isValid = true;
    
    if (!email.trim()) {
      setEmailError(validationMessages.email.required);
      isValid = false;
    } else if (!validateEmail(email.trim())) {
      setEmailError(validationMessages.email.invalid);
      isValid = false;
    } else {
      setEmailError('');
    }
    
    return isValid;
  };

  const handleResetPassword = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Aquí iría la lógica real de reset de contraseña
      // await resetPasswordAPI(email.trim());
      
      setResetSent(true);
      
      Alert.alert(
        'Email Enviado',
        'Te hemos enviado un email con instrucciones para restablecer tu contraseña.',
        [
          {
            text: 'OK',
            onPress: () => navigation?.goBack && navigation.goBack()
          }
        ]
      );
      
    } catch (error) {
      Alert.alert(
        'Error',
        'Hubo un problema al enviar el email. Por favor, intenta nuevamente.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigation?.goBack && navigation.goBack();
  };

  if (resetSent) {
    return (
      <Container>
        <View style={passwordResetStyles.container}>
          <View style={passwordResetStyles.successContainer}>
            <Text style={passwordResetStyles.successTitle}>
              Email Enviado
            </Text>
            <Text style={passwordResetStyles.successMessage}>
              Te hemos enviado un email con las instrucciones para restablecer tu contraseña.
            </Text>
            <Text style={passwordResetStyles.successSubmessage}>
              Revisa tu bandeja de entrada y sigue los pasos indicados.
            </Text>
            <CustomButton
              title="Volver al Login"
              onPress={handleBackToLogin}
              style={passwordResetStyles.backButton}
            />
          </View>
        </View>
      </Container>
    );
  }

  return (
    <Container>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={passwordResetStyles.keyboardContainer}
      >
        <View style={passwordResetStyles.container}>
          <View style={passwordResetStyles.header}>
            <Text style={passwordResetStyles.title}>
              Restablecer Contraseña
            </Text>
            <Text style={passwordResetStyles.subtitle}>
              Ingresa tu email y te enviaremos las instrucciones para restablecer tu contraseña
            </Text>
          </View>

          <View style={passwordResetStyles.form}>
            <CustomInput
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              error={!!emailError}
              errorMessage={emailError}
            />
            
            <CustomButton
              title="Enviar Instrucciones"
              onPress={handleResetPassword}
              loading={loading}
              disabled={loading}
            />
            
            <CustomButton
              title="Volver al Login"
              onPress={handleBackToLogin}
              variant="secondary"
              style={passwordResetStyles.secondaryButton}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Container>
  );
};