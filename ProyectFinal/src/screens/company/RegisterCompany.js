import React, { useState, useEffect, useRef } from "react";
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
        proofOfAddress: null,
    });
    const [showBanner, setShowBanner] = useState(false);
    const [bannerMessage, setBannerMessage] = useState('');
    const [bannerType, setBannerType] = useState('success');
    const [passwordErrors, setPasswordErrors] = useState([]);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});
    const [placeResults, setPlaceResults] = useState([]);
    const [loadingPlaces, setLoadingPlaces] = useState(false);
    const [suppressPlaces, setSuppressPlaces] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const submittingRef = useRef(false);

    const PLACES_API_KEY = process.env.EXPO_PUBLIC_PLACES_API_KEY || process.env.PLACES_API_KEY || "";

    const normalizeStr = (s) =>
        (s || "")
            .toLowerCase()
            .normalize("NFD")
            .replace(/\p{Diacritic}/gu, "")
            .trim();

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

    const fetchPlaces = async (text) => {
        if (!PLACES_API_KEY || text.trim().length < 3) {
            setPlaceResults([]);
            return;
        }
        setLoadingPlaces(true);
        try {
            const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(text)}&key=${PLACES_API_KEY}&components=country:mx`;
            const res = await fetch(url);
            const data = await res.json();
            const predictions = data?.predictions || [];
            setPlaceResults(predictions.map((p) => p.description));
        } catch (error) {
            console.error("Error fetching places:", error);
        } finally {
            setLoadingPlaces(false);
        }
    };

    useEffect(() => {
        if (suppressPlaces) {
            setSuppressPlaces(false);
            return;
        }
        const handler = setTimeout(() => {
            fetchPlaces(formData.address || "");
        }, 350);
        return () => clearTimeout(handler);
    }, [formData.address, suppressPlaces]);

    const ensureLibraryPermission = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
            Alert.alert("Permiso requerido", "Habilita acceso a tus fotos para elegir una imagen.");
            return false;
        }
        return true;
    };

    const handleImagePick = async (field) => {
        const hasPermission = await ensureLibraryPermission();
        if (!hasPermission) return;

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

    const ensureCameraPermission = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== "granted") {
            Alert.alert("Permiso requerido", "Habilita la cámara para tomar la foto.");
            return false;
        }
        return true;
    };

    const handleCameraCapture = async (field, side) => {
        const hasPermission = await ensureCameraPermission();
        if (!hasPermission) return;

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

    const handleSingleCameraCapture = async (field) => {
        const hasPermission = await ensureCameraPermission();
        if (!hasPermission) return;

        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: false,
            aspect: [4, 3],
            quality: 0.8,
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
        });

        if (!result.canceled) {
            setFormData(prev => ({
                ...prev,
                [field]: result.assets[0].uri
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

        // Validar logo
        if (!formData.logo) {
            newErrors.logo = 'Sube el logo de la empresa';
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
        if (!formData.proofOfAddress) {
            newErrors.proofOfAddress = 'Captura el comprobante de domicilio';
        }

        setValidationErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const setSubmittingGuard = (value) => {
        submittingRef.current = value;
        setSubmitting(value);
    };

    const handleRegister = async () => {
        if (submittingRef.current) return;
        setSubmittingGuard(true);

        if (!validateForm()) {
            setBannerMessage('Por favor, revisa los campos marcados en rojo');
            setBannerType('error');
            setShowBanner(true);
            setSubmittingGuard(false);
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
                    setSubmittingGuard(false);
                    navigation.navigate('LoginCompany');
                }, 2000);
            } else {
                setBannerMessage(result.message || 'No se pudo registrar la empresa');
                setBannerType('error');
                setShowBanner(true);
                setSubmittingGuard(false);
            }
        } catch (error) {
            console.error('Error al registrar empresa', error);
            setBannerMessage('Ocurrió un error al registrar la empresa. Intenta más tarde.');
            setBannerType('error');
            setShowBanner(true);
            setSubmittingGuard(false);
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
                                <View style={{
                                    padding: 12,
                                    borderRadius: 16,
                                    borderWidth: 1.5,
                                    borderStyle: formData.logo ? "solid" : "dashed",
                                    borderColor: formData.logo ? COLORS.primary : COLORS.borderSecondary,
                                    backgroundColor: formData.logo ? "#f2f8ff" : "#fff",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    minHeight: 150,
                                    width: 170,
                                    alignSelf: "center",
                                    shadowColor: "#000",
                                    shadowOpacity: 0.06,
                                    shadowRadius: 6,
                                    shadowOffset: { width: 0, height: 3 },
                                    elevation: 3,
                                }}>
                                    {formData.logo ? (
                                        <>
                                            <Image source={{ uri: formData.logo }} style={[styles.logoImage, { marginBottom: 12 }]} />
                                            <Text style={{ color: COLORS.primary, fontWeight: "600" }}>Cambiar logo</Text>
                                        </>
                                    ) : (
                                        <>
                                            <View style={[styles.logoPlaceholder, { width: 90, height: 90, borderRadius: 45 }]}>
                                                <Ionicons name="business-outline" size={50} color={COLORS.primary} />
                                            </View>
                                            <Text style={{ marginTop: 10, color: COLORS.textBlack, fontWeight: "700" }}>
                                                Sube tu logo
                                            </Text>
                                        </>
                                    )}
                                </View>
                            </Pressable>
                            {validationErrors.logo && (
                                <Text style={[styles.errorText, { textAlign: "center", marginTop: 8 }]}>
                                    {validationErrors.logo}
                                </Text>
                            )}
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

                            <View style={styles.group}>
                                <Text style={styles.label}>Dirección</Text>
                                <InputLogin 
                                    msj="Calle, número, colonia, CP"
                                    value={formData.address}
                                    onChangeText={(text) => setFormData(prev => ({...prev, address: text}))}
                                    multiline
                                    numberOfLines={2}
                                    keyboardType="default"
                                    style={{
                                        borderColor: validationErrors.address ? '#f44336' : undefined,
                                        borderWidth: validationErrors.address ? 1.5 : undefined
                                    }}
                                />
                                {loadingPlaces && (
                                    <Text style={{ color: COLORS.textGray, marginTop: 4 }}>Buscando direcciones...</Text>
                                )}
                                {(() => {
                                    const currentNorm = normalizeStr(formData.address);
                                    const normalized = placeResults
                                        .map((p) => ({
                                            raw: (p || "").trim(),
                                            norm: normalizeStr(p),
                                        }))
                                        .filter((p) => p.raw.length > 0 && p.norm.length > 0);

                                    const seen = new Set();
                                    const unique = normalized.filter((p) => {
                                        if (p.norm === currentNorm) return false;
                                        if (seen.has(p.norm)) return false;
                                        seen.add(p.norm);
                                        return true;
                                    }).map((p) => p.raw);

                                    if (unique.length === 0) return null;
                                    return (
                                        <View style={{
                                            marginTop: 6,
                                            borderWidth: 1,
                                            borderColor: COLORS.borderSecondary,
                                            borderRadius: 10,
                                            backgroundColor: COLORS.backgroundWhite,
                                            elevation: 2,
                                            shadowColor: "#000",
                                            shadowOpacity: 0.08,
                                            shadowRadius: 6,
                                            shadowOffset: { width: 0, height: 2 },
                                        }}>
                                            {unique.slice(0, 5).map((place) => (
                                                <Pressable
                                                    key={place}
                                                    onPress={() => {
                                                        setFormData(prev => ({...prev, address: place}));
                                                        setPlaceResults([]);
                                                        setSuppressPlaces(true);
                                                    }}
                                                    style={({pressed}) => [
                                                        { paddingVertical: 10, paddingHorizontal: 12 },
                                                        pressed && { opacity: 0.7 }
                                                    ]}
                                                >
                                                    <Text style={{ color: COLORS.textBlack }}>{place}</Text>
                                                </Pressable>
                                            ))}
                                        </View>
                                    );
                                })()}
                                {validationErrors.address && (
                                    <Text style={styles.errorText}>{validationErrors.address}</Text>
                                )}
                            </View>

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

                                <View style={[
                                    styles.documentCaptureContainer,
                                    validationErrors.proofOfAddress && { borderColor: '#f44336', borderWidth: 2 }
                                ]}>
                                    <Text style={styles.sectionTitle}>Comprobante de Domicilio</Text>

                                    <Pressable 
                                        onPress={() => handleSingleCameraCapture('proofOfAddress')}
                                        style={({pressed}) => [
                                            styles.cameraSide,
                                            pressed && {opacity: 0.7},
                                            formData.proofOfAddress && styles.cameraSideCaptured
                                        ]}
                                    >
                                        {formData.proofOfAddress ? (
                                            <View style={styles.capturedImageContainer}>
                                                <Image 
                                                    source={{ uri: formData.proofOfAddress }} 
                                                    style={styles.capturedImage}
                                                />
                                                <View style={styles.capturedBadge}>
                                                    <Ionicons name="checkmark-circle" size={32} color="#4caf50" />
                                                </View>
                                            </View>
                                        ) : (
                                            <View style={styles.cameraPlaceholder}>
                                                <Ionicons name="camera-outline" size={40} color={COLORS.primary} />
                                                <Text style={styles.cameraText}>Foto</Text>
                                            </View>
                                        )}
                                    </Pressable>
                                    {validationErrors.proofOfAddress && (
                                        <Text style={styles.errorText}>{validationErrors.proofOfAddress}</Text>
                                    )}
                                </View>
                            </View>

                            <View style={styles.buttonContainer}>
                                <ButtonLogin
                                    title={submitting ? "Registrando..." : "Registrar Empresa"}
                                    onPress={submitting ? undefined : handleRegister}
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
