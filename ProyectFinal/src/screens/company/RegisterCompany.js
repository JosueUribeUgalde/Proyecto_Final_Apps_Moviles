import React, { useState } from "react";
import { 
    View, 
    Text, 
    Image, 
    ScrollView,
    Pressable,
    KeyboardAvoidingView,
    Platform
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { Ionicons } from '@expo/vector-icons';
import { HeaderScreen, InputLogin, ButtonLogin, Banner } from "../../components";
import { COLORS } from "../../components/constants/theme";
import styles from "../../styles/screens/company/RegisterStyles";

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
        officialId: null,
        proofOfAddress: null,
        fiscalStatus: null
    });
    const [showBanner, setShowBanner] = useState(false);
    const [bannerMessage, setBannerMessage] = useState('');
    const [bannerType, setBannerType] = useState('success');
    const [passwordErrors, setPasswordErrors] = useState([]);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

    const handleDocumentPick = async (field) => {
        const result = await DocumentPicker.getDocumentAsync({
            type: ['application/pdf'],
            copyToCacheDirectory: true
        });

        if (result.type === 'success') {
            setFormData(prev => ({
                ...prev,
                [field]: result.uri
            }));
        }
    };

    const handleRegister = () => {
        // Validar contraseña
        const errors = validatePassword(formData.password);
        
        if (formData.password !== formData.confirmPassword) {
            errors.push('Las contraseñas no coinciden');
        }

        if (errors.length > 0) {
            setPasswordErrors(errors);
            setBannerMessage('Por favor, revisa los requisitos de la contraseña');
            setBannerType('error');
            setShowBanner(true);
            return;
        }

        setPasswordErrors([]);
        setBannerMessage('Registro exitoso');
        setBannerType('success');
        setShowBanner(true);
        setTimeout(() => {
            setShowBanner(false);
            navigation.navigate('LoginCompany');
        }, 2000);
    };

    const renderDocumentButton = (title, field, type = 'document') => (
        <Pressable 
            onPress={() => type === 'image' ? handleImagePick(field) : handleDocumentPick(field)}
            style={({pressed}) => [
                styles.documentButton,
                pressed && {opacity: 0.7}
            ]}
        >
            <Ionicons 
                name={type === 'image' ? "image-outline" : "document-text-outline"} 
                size={24} 
                color={COLORS.primary} 
            />
            <Text style={styles.documentButtonText}>{title}</Text>
            {formData[field] && (
                <Ionicons name="checkmark-circle" size={24} color={COLORS.primary} />
            )}
        </Pressable>
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
                            <View style={styles.group}>
                                <Text style={styles.label}>Nombre de la Empresa</Text>
                                <InputLogin 
                                    msj="Nombre de la empresa" 
                                    value={formData.companyName}
                                    onChangeText={(text) => setFormData(prev => ({...prev, companyName: text}))}
                                />
                            </View>

                            <View style={styles.group}>
                                <Text style={styles.label}>Correo Electrónico</Text>
                                <InputLogin 
                                    msj="empresa@correo.com"
                                    keyboardType="email-address"
                                    value={formData.email}
                                    onChangeText={(text) => setFormData(prev => ({...prev, email: text}))}
                                />
                            </View>

                            <View style={styles.group}>
                                <Text style={styles.label}>Teléfono</Text>
                                <InputLogin 
                                    msj="(XXX) XXX-XXXX"
                                    keyboardType="phone-pad"
                                    value={formData.phone}
                                    onChangeText={(text) => setFormData(prev => ({...prev, phone: text}))}
                                />
                            </View>

                            <View style={styles.group}>
                                <Text style={styles.label}>RFC</Text>
                                <InputLogin 
                                    msj="XXXX000000XXX"
                                    autoCapitalize="characters"
                                    value={formData.rfc}
                                    onChangeText={(text) => setFormData(prev => ({...prev, rfc: text}))}
                                />
                            </View>

                            <View style={styles.group}>
                                <Text style={styles.label}>Dirección Fiscal</Text>
                                <InputLogin 
                                    msj="Dirección completa"
                                    multiline
                                    numberOfLines={2}
                                    value={formData.address}
                                    onChangeText={(text) => setFormData(prev => ({...prev, address: text}))}
                                />
                            </View>

                            <View style={styles.group}>
                                <Text style={styles.label}>Nombre del Representante</Text>
                                <InputLogin 
                                    msj="Nombre completo"
                                    value={formData.ownerName}
                                    onChangeText={(text) => setFormData(prev => ({...prev, ownerName: text}))}
                                />
                            </View>

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
                                    <Text style={styles.errorText}>Las contraseñas no coinciden</Text>
                                )}
                                {formData.confirmPassword && formData.password === formData.confirmPassword && (
                                    <Text style={styles.successText}>✓ Las contraseñas coinciden</Text>
                                )}
                            </View>

                            {/* Documentos */}
                            <View style={styles.documentsContainer}>
                                <Text style={styles.sectionTitle}>Documentos Requeridos</Text>
                                {renderDocumentButton('Identificación Oficial', 'officialId')}
                                {renderDocumentButton('Comprobante de Domicilio', 'proofOfAddress')}
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
