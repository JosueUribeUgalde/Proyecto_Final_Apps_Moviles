import React, { useState } from "react";
import { 
    View, 
    Text, 
    Image, 
    ScrollView,
    Pressable,
    KeyboardAvoidingView,
    Platform,
    Alert
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { HeaderScreen, InputLogin, ButtonLogin, Banner } from "../../components";
import { COLORS } from "../../components/constants/theme";
import styles from "../../styles/screens/company/RegisterStyles";
import { registerCompany } from '../../services/companyService';

export default function RegisterCompany({ navigation }) {
    const [formData, setFormData] = useState({
        companyName: '',
        email: '',
        phone: '',
        rfc: '',
        address: '',
        ownerName: '',
        password: '',
        confirmPassword: '',
        logo: null,
        officialId: {
            front: null,
            back: null
        },
        proofOfAddress: {
            front: null,
            back: null
        }
    });
    const [showBanner, setShowBanner] = useState(false);
    const [bannerMessage, setBannerMessage] = useState('');
    const [bannerType, setBannerType] = useState('success');
    const [passwordErrors, setPasswordErrors] = useState([]);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});

    // Función para validar email
    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // Función para validar RFC (México - 13 caracteres)
    const isValidRFC = (rfc) => {
        const rfcRegex = /^[A-ZÑ&]{3,4}\d{6}(?:[A-Z0-9]{3})?$/;
        return rfcRegex.test(rfc.toUpperCase()) && rfc.length >= 12;
    };

    // Función para validar teléfono (México - 10 dígitos)
    const isValidPhone = (phone) => {
        const phoneRegex = /^\d{10}$/;
        const cleanPhone = phone.replace(/\D/g, '');
        return phoneRegex.test(cleanPhone) && cleanPhone.length === 10;
    };

    // Función para validar dirección
    const isValidAddress = (address) => {
        return address && address.trim().length >= 10;
    };

    const validatePassword = (password) => {
        const errors = [];
        
        if (password.length < 8) {
            errors.push('Mínimo 8 caracteres');
        }
        if (!/[A-Z]/.test(password)) {
            errors.push('Al menos una mayúscula');
        }
        if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
            errors.push('Al menos un carácter especial (!@#$%^&*)');
        }
        
        return errors;
    };

    const handleImagePick = async (field) => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setFormData(prev => ({
                ...prev,
                [field]: result.assets[0].uri
            }));
        }
    };

    const handleCameraCapture = async (field, side) => {
        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: false,
            aspect: [4, 3],
            quality: 0.8,
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
        });

        if (!result.canceled) {
            setFormData(prev => ({
                ...prev,
                [field]: {
                    ...prev[field],
                    [side]: result.assets[0].uri
                }
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        // Validar nombre empresa
        if (!formData.companyName || formData.companyName.trim().length < 3) {
            newErrors.companyName = 'Nombre de empresa inválido (mínimo 3 caracteres)';
        }

        // Validar email
        if (!formData.email || !isValidEmail(formData.email)) {
            newErrors.email = 'Email inválido (ej: empresa@correo.com)';
        }

        // Validar teléfono
        if (!formData.phone || !isValidPhone(formData.phone)) {
            newErrors.phone = 'Teléfono inválido (10 dígitos)';
        }

        // Validar RFC
        if (!formData.rfc || !isValidRFC(formData.rfc)) {
            newErrors.rfc = 'RFC inválido (ej: ABC000000XYZ)';
        }

        // Validar dirección
        if (!formData.address || !isValidAddress(formData.address)) {
            newErrors.address = 'Dirección inválida (mínimo 10 caracteres)';
        }

        // Validar nombre del representante
        if (!formData.ownerName || formData.ownerName.trim().length < 3) {
            newErrors.ownerName = 'Nombre inválido (mínimo 3 caracteres)';
        }

        // Validar contraseña
        const passwordErrors = validatePassword(formData.password);
        if (formData.password !== formData.confirmPassword) {
            passwordErrors.push('Las contraseñas no coinciden');
        }
        if (passwordErrors.length > 0) {
            newErrors.password = passwordErrors;
        }

        // Validar documentos
        if (!formData.officialId.front || !formData.officialId.back) {
            newErrors.officialId = 'Captura frente y reverso de tu identificación';
        }
        
        // Validar Comprobante de domicilio (frente y reverso)
        if (!formData.proofOfAddress.front || !formData.proofOfAddress.back) {
            newErrors.proofOfAddress = 'Captura frente y reverso del comprobante';
        }

        setValidationErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleRegister = async () => {
        if (!validateForm()) {
            setBannerMessage('Por favor, revisa los campos marcados en rojo');
            setBannerType('error');
            setShowBanner(true);
            return;
        }

        try {
            const result = await registerCompany(formData);

            if (result.success) {
                setBannerMessage(result.message || 'Registro exitoso');
                setBannerType('success');
                setShowBanner(true);

                setTimeout(() => {
                    setShowBanner(false);
                    navigation.navigate('LoginCompany');
                }, 2000);
            } else {
                setBannerMessage(result.message || 'No se pudo registrar la empresa');
                setBannerType('error');
                setShowBanner(true);
            }
        } catch (error) {
            console.error('Error al registrar empresa', error);
            setBannerMessage('Ocurrió un error al registrar la empresa. Intenta más tarde.');
            setBannerType('error');
            setShowBanner(true);
        }
    };

    // Componente para capturar documento con 2 lados
    const DocumentCapture = ({ title, field, type }) => {
        const isFrontCaptured = formData[field].front;
        const isBackCaptured = formData[field].back;
        const hasError = validationErrors[field];

        return (
            <View style={[
                styles.documentCaptureContainer,
                hasError && { borderColor: '#f44336', borderWidth: 2 }
            ]}>
                <Text style={styles.sectionTitle}>{title}</Text>
                
                {/* Lado Frente */}
                <Pressable 
                    onPress={() => handleCameraCapture(field, 'front')}
                    style={({pressed}) => [
                        styles.cameraSide,
                        pressed && {opacity: 0.7},
                        isFrontCaptured && styles.cameraSideCaptured
                    ]}
                >
                    {isFrontCaptured ? (
                        <View style={styles.capturedImageContainer}>
                            <Image 
                                source={{ uri: formData[field].front }} 
                                style={styles.capturedImage}
                            />
                            <View style={styles.capturedBadge}>
                                <Ionicons name="checkmark-circle" size={32} color="#4caf50" />
                            </View>
                        </View>
                    ) : (
                        <View style={styles.cameraPlaceholder}>
                            <Ionicons name="camera-outline" size={40} color={COLORS.primary} />
                            <Text style={styles.cameraText}>Frente</Text>
                        </View>
                    )}
                </Pressable>

                {/* Lado Reverso */}
                <Pressable 
                    onPress={() => handleCameraCapture(field, 'back')}
                    style={({pressed}) => [
                        styles.cameraSide,
                        pressed && {opacity: 0.7},
                        isBackCaptured && styles.cameraSideCaptured
                    ]}
                >
                    {isBackCaptured ? (
                        <View style={styles.capturedImageContainer}>
                            <Image 
                                source={{ uri: formData[field].back }} 
                                style={styles.capturedImage}
                            />
                            <View style={styles.capturedBadge}>
                                <Ionicons name="checkmark-circle" size={32} color="#4caf50" />
                            </View>
                        </View>
                    ) : (
                        <View style={styles.cameraPlaceholder}>
                            <Ionicons name="camera-outline" size={40} color={COLORS.primary} />
                            <Text style={styles.cameraText}>Reverso</Text>
                        </View>
                    )}
                </Pressable>

                {hasError && (
                    <Text style={styles.errorText}>{validationErrors[field]}</Text>
                )}
            </View>
        );
    };

    const renderDocumentButton = (title, field, type = 'document') => (
        <View>
            <Pressable 
                onPress={() => type === 'image' ? handleImagePick(field) : handleDocumentPick(field)}
                style={({pressed}) => [
                    styles.documentButton,
                    pressed && {opacity: 0.7},
                    validationErrors[field] && {borderColor: '#f44336', borderWidth: 2}
                ]}
            >
                <Ionicons 
                    name={type === 'image' ? "image-outline" : "document-text-outline"} 
                    size={24} 
                    color={formData[field] ? COLORS.primary : '#999'} 
                />
                <Text style={styles.documentButtonText}>{title}</Text>
                {formData[field] && (
                    <Ionicons name="checkmark-circle" size={24} color="#4caf50" />
                )}
            </Pressable>
            {validationErrors[field] && (
                <Text style={styles.errorText}>{validationErrors[field]}</Text>
            )}
        </View>
    );

    const renderInputWithError = (label, field, value, onChangeText, keyboardType = 'default', multiline = false) => (
        <View style={styles.group}>
            <Text style={styles.label}>{label}</Text>
            <InputLogin 
                msj={label}
                keyboardType={keyboardType}
                value={value}
                onChangeText={onChangeText}
                multiline={multiline}
                numberOfLines={multiline ? 2 : 1}
                style={{
                    borderColor: validationErrors[field] ? '#f44336' : undefined,
                    borderWidth: validationErrors[field] ? 1.5 : undefined
                }}
            />
            {validationErrors[field] && (
                <Text style={styles.errorText}>{validationErrors[field]}</Text>
            )}
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <HeaderScreen 
                title="Registro de Empresa"
                leftIcon={<Ionicons name="arrow-back" size={24} color="black" />}
                onLeftPress={() => navigation.goBack()}
            />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView 
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.contentContainer}>
                        <View style={styles.welcomeContainer}>
                            <Pressable onPress={() => handleImagePick('logo')}>
                                {formData.logo ? (
                                    <Image source={{ uri: formData.logo }} style={styles.logoImage} />
                                ) : (
                                    <View style={styles.logoPlaceholder}>
                                        <Ionicons name="business-outline" size={50} color={COLORS.primary} />
                                        <Text style={styles.logoPlaceholderText}>Logo empresa</Text>
                                    </View>
                                )}
                            </Pressable>
                        </View>

                        {/* Formulario */}
                        <View style={styles.formContainer}>
                            {renderInputWithError(
                                'Nombre de la Empresa',
                                'companyName',
                                formData.companyName,
                                (text) => setFormData(prev => ({...prev, companyName: text}))
                            )}

                            {renderInputWithError(
                                'Correo Electrónico',
                                'email',
                                formData.email,
                                (text) => setFormData(prev => ({...prev, email: text})),
                                'email-address'
                            )}

                            {renderInputWithError(
                                'Teléfono (10 dígitos)',
                                'phone',
                                formData.phone,
                                (text) => setFormData(prev => ({...prev, phone: text.replace(/\D/g, '').slice(0, 10)})),
                                'phone-pad'
                            )}

                            {renderInputWithError(
                                'RFC',
                                'rfc',
                                formData.rfc,
                                (text) => setFormData(prev => ({...prev, rfc: text.toUpperCase().slice(0, 13)}))
                            )}

                            {renderInputWithError(
                                'Dirección',
                                'address',
                                formData.address,
                                (text) => setFormData(prev => ({...prev, address: text})),
                                'default',
                                true
                            )}

                            {renderInputWithError(
                                'Nombre del Representante',
                                'ownerName',
                                formData.ownerName,
                                (text) => setFormData(prev => ({...prev, ownerName: text}))
                            )}

                            {/* Contraseña */}
                            <View style={styles.group}>
                                <Text style={styles.label}>Contraseña</Text>
                                <View style={styles.passwordContainer}>
                                    <InputLogin 
                                        msj="Mínimo 8 caracteres"
                                        secureTextEntry={!showPassword}
                                        value={formData.password}
                                        onChangeText={(text) => {
                                            setFormData(prev => ({...prev, password: text}));
                                            setPasswordErrors(validatePassword(text));
                                        }}
                                        style={{flex: 1}}
                                    />
                                    <Pressable 
                                        onPress={() => setShowPassword(!showPassword)}
                                        style={styles.eyeButton}
                                    >
                                        <Ionicons 
                                            name={showPassword ? "eye-off" : "eye"} 
                                            size={24} 
                                            color={COLORS.primary} 
                                        />
                                    </Pressable>
                                </View>
                                {passwordErrors.length > 0 && (
                                    <View style={styles.errorsContainer}>
                                        {passwordErrors.map((error, index) => (
                                            <Text key={index} style={styles.errorText}>
                                                • {error}
                                            </Text>
                                        ))}
                                    </View>
                                )}
                            </View>

                            <View style={styles.group}>
                                <Text style={styles.label}>Confirmar Contraseña</Text>
                                <View style={styles.passwordContainer}>
                                    <InputLogin 
                                        msj="Repite tu contraseña"
                                        secureTextEntry={!showConfirmPassword}
                                        value={formData.confirmPassword}
                                        onChangeText={(text) => setFormData(prev => ({...prev, confirmPassword: text}))}
                                        style={{flex: 1}}
                                    />
                                    <Pressable 
                                        onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                        style={styles.eyeButton}
                                    >
                                        <Ionicons 
                                            name={showConfirmPassword ? "eye-off" : "eye"} 
                                            size={24} 
                                            color={COLORS.primary} 
                                        />
                                    </Pressable>
                                </View>
                                {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                                    <Text style={styles.errorText}>✗ Las contraseñas no coinciden</Text>
                                )}
                                {formData.confirmPassword && formData.password === formData.confirmPassword && (
                                    <Text style={styles.successText}>✓ Las contraseñas coinciden</Text>
                                )}
                            </View>

                            {/* Documentos - NUEVA VERSIÓN */}
                            <View style={styles.documentsContainer}>
                                <Text style={{fontSize: 16, fontWeight: 'bold', marginBottom: 16}}>
                                    Documentos (Captura con Cámara)
                                </Text>
                                
                                <DocumentCapture 
                                    title="Identificación Oficial"
                                    field="officialId"
                                    type="identification"
                                />
                                
                                <DocumentCapture 
                                    title="Comprobante de Domicilio"
                                    field="proofOfAddress"
                                    type="address"
                                />
                            </View>

                            <View style={styles.buttonContainer}>
                                <ButtonLogin
                                    title="Registrar Empresa"
                                    onPress={handleRegister}
                                    icon={<Ionicons name="business" size={24} color="white" />}
                                />
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

            <Banner
                visible={showBanner}
                message={bannerMessage}
                type={bannerType}
                onHide={() => setShowBanner(false)}
            />
        </SafeAreaView>
    );
}
