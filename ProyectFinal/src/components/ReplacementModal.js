import { useState, useEffect } from 'react';
import { Text, View, Modal, Pressable, ActivityIndicator, ScrollView } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from './constants/theme';
import { getDoc, doc } from "firebase/firestore";
import { db } from "../config/firebaseConfig";
import { createSustitucionRequest, approvePeticion } from "../services/peticionService";
import { getCurrentUser } from "../services/authService";
import styles from "../styles/screens/admin/ReplacementModalStyles";

export default function ReplacementModal({
  visible,
  onClose,
  request,
  groupId,
  groupMembers,
  onSuccess
}) {
  const [step, setStep] = useState('options');
  const [selectedMember, setSelectedMember] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sortedMembers, setSortedMembers] = useState([]);
  const currentUser = getCurrentUser();

  useEffect(() => {
    if (visible) {
      if (groupId) {
        loadMembersData(groupId);
      }
    } else {
      setStep('options');
      setSelectedMember(null);
    }
  }, [visible, groupId]);

  const loadMembersData = async (groupIdParam) => {
    try {
      setLoading(true);
      
      let memberIds = groupMembers;
      if (!memberIds || memberIds.length === 0) {
        const groupDoc = await getDoc(doc(db, "groups", groupIdParam));
        if (groupDoc.exists()) {
          memberIds = groupDoc.data().memberIds || [];
        } else {
          setLoading(false);
          return;
        }
      }

      if (!memberIds || memberIds.length === 0) {
        setSortedMembers([]);
        setLoading(false);
        return;
      }

      const members = [];

      for (const memberId of memberIds) {
        try {
          const userDoc = await getDoc(doc(db, "users", memberId));
          if (userDoc.exists() && userDoc.id !== request?.userId) {
            members.push({
              id: userDoc.id,
              ...userDoc.data()
            });
          }
        } catch (error) {
          console.error(`Error cargando miembro ${memberId}:`, error);
        }
      }

      const available = members.filter(m => m.status === 'Disponible');
      const notAvailable = members.filter(m => m.status !== 'Disponible');
      const sorted = [...available, ...notAvailable];
      
      setSortedMembers(sorted);
    } catch (error) {
      console.error("Error al cargar datos de miembros:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOptionSelect = (option) => {
    if (option === 'manual') {
      setStep('manual-selection');
      setSelectedMember(null);
    } else if (option === 'ia') {
      alert('Sugerencia de IA - Funcionalidad en desarrollo');
    } else if (option === 'sin-asignar') {
      handleConfirmReplacement(null);
    }
  };

  const handleConfirmReplacement = async (selectedMemberId) => {
    try {
      setLoading(true);

      // Solo crear solicitud de sustitución si se seleccionó un miembro
      if (selectedMemberId) {
        await createSustitucionRequest({
          idAdmin: currentUser.uid,
          idPeticion: request.id,
          idUserSolicitado: selectedMemberId,
          userName: request.userName,
          userPosition: request.position,
          reason: request.reason,
          date: request.date,
          startTime: request.startTime,
          groupId: groupId
        });
      }

      // Aprobar la petición (con o sin remplazo asignado)
      await approvePeticion(request.id, groupId, selectedMemberId || null);

      onClose();
      if (onSuccess) {
        onSuccess(selectedMemberId);
      }
    } catch (error) {
      console.error("Error al confirmar remplazo:", error);
      alert('Error al procesar la solicitud. Intenta nuevamente: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestSubstitution = async (memberId) => {
    setSelectedMember(memberId);
    
    setTimeout(() => {
      handleConfirmReplacement(memberId);
    }, 300);
  };

  const renderMemberCard = (item) => {
    const isAvailable = item.status === 'Disponible';
    const isSelected = selectedMember === item.id;

    const displayName = item.name || item.userName || 'Sin nombre';
    const displayPosition = item.position || 'Sin posición';

    const availableDays = item.availableDays 
      ? item.availableDays.split('•').map(d => d.trim()).join(', ')
      : 'N/A';

    const scheduleStart = item.scheduleStart || 'N/A';
    const scheduleEnd = item.scheduleEnd || 'N/A';

    return (
      <View
        key={item.id}
        style={[
          styles.memberCard,
          isSelected && { borderColor: COLORS.primary, borderWidth: 2 }
        ]}
      >
        <View style={styles.memberCardHeader}>
          <View style={styles.memberInfo}>
            <Text style={styles.memberName}>{displayName}</Text>
            <Text style={styles.memberPosition}>{displayPosition}</Text>
          </View>
          <View
            style={[
              styles.memberStatus,
              isAvailable ? styles.memberStatusAvailable : styles.memberStatusBusy
            ]}
          >
            <Text
              style={[
                styles.memberStatusText,
                isAvailable ? styles.memberStatusAvailableText : styles.memberStatusBusyText
              ]}
            >
              {item.status}
            </Text>
          </View>
        </View>

        <View style={styles.memberDetails}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Horario:</Text>
            <Text style={styles.detailValue}>
              {scheduleStart} - {scheduleEnd}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Días disponibles:</Text>
            <Text style={[
              styles.detailValue,
              availableDays === 'N/A' && styles.detailValueUnavailable
            ]}>
              {availableDays}
            </Text>
          </View>
        </View>

        <Pressable
          style={[
            styles.requestSubstitutionButton,
            (loading || !isAvailable) && styles.requestSubstitutionButtonDisabled
          ]}
          onPress={() => handleRequestSubstitution(item.id)}
          disabled={loading || !isAvailable}
        >
          <Ionicons
            name={isSelected ? "checkmark-circle" : "person-add-outline"}
            size={18}
            color={COLORS.backgroundWhite}
          />
          <Text style={styles.requestSubstitutionButtonText}>
            {isSelected ? 'Seleccionado' : 'Pedir Sustitución'}
          </Text>
        </Pressable>
      </View>
    );
  };

  const handleBackFromSelection = () => {
    setStep('options');
    setSelectedMember(null);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable
        style={styles.overlay}
        onPress={onClose}
      >
        <Pressable
          style={styles.modalContainer}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {step === 'options' ? 'Asignar Remplazo' : 'Seleccionar Miembro'}
            </Text>
            <Pressable
              style={styles.closeButton}
              onPress={onClose}
            >
              <Ionicons name="close" size={24} color={COLORS.textBlack} />
            </Pressable>
          </View>

          {step === 'options' ? (
            <View style={styles.optionsContainer}>
              <Pressable
                style={styles.optionButton}
                onPress={() => handleOptionSelect('manual')}
              >
                <View style={styles.optionIconContainer}>
                  <Ionicons name="person-outline" size={24} color={COLORS.primary} />
                </View>
                <View style={styles.optionTextContainer}>
                  <Text style={styles.optionTitle}>Selección Manual</Text>
                  <Text style={styles.optionSubtitle}>
                    Elige un miembro del grupo
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color={COLORS.textGray} />
              </Pressable>

              <Pressable
                style={styles.optionButton}
                onPress={() => handleOptionSelect('ia')}
              >
                <View style={[styles.optionIconContainer, styles.optionIconContainerDisabled]}>
                  <Ionicons name="sparkles" size={24} color={COLORS.textGray} />
                </View>
                <View style={styles.optionTextContainer}>
                  <Text style={styles.optionTitle}>Sugerencia de IA</Text>
                  <Text style={[styles.optionSubtitle, styles.optionSubtitleDisabled]}>
                    Próximamente disponible
                  </Text>
                </View>
              </Pressable>

              <Pressable
                style={styles.optionButton}
                onPress={() => handleOptionSelect('sin-asignar')}
              >
                <View style={styles.optionIconContainer}>
                  <Ionicons name="close-circle-outline" size={24} color={COLORS.primary} />
                </View>
                <View style={styles.optionTextContainer}>
                  <Text style={styles.optionTitle}>Sin Asignar Remplazo</Text>
                  <Text style={styles.optionSubtitle}>
                    Aprobar sin designar sustituto
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color={COLORS.textGray} />
              </Pressable>
            </View>
          ) : (
            <View style={styles.selectionContainer}>
              <ScrollView 
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
              >
                {loading ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                    <Text style={styles.loadingText}>Cargando miembros...</Text>
                  </View>
                ) : sortedMembers.length > 0 ? (
                  <View style={styles.membersContainer}>
                    {sortedMembers.filter(m => m.status === 'Disponible').length > 0 && (
                      <View>
                        <Text style={styles.membersTitle}>Miembros Disponibles</Text>
                        {sortedMembers.filter(m => m.status === 'Disponible').map((item) => 
                          renderMemberCard(item)
                        )}
                      </View>
                    )}

                    {sortedMembers.filter(m => m.status !== 'Disponible').length > 0 && (
                      <View>
                        <Text style={styles.availabilityLabel}>Otros Miembros</Text>
                        {sortedMembers.filter(m => m.status !== 'Disponible').map((item) => 
                          renderMemberCard(item)
                        )}
                      </View>
                    )}
                  </View>
                ) : (
                  <View style={styles.emptyMembersContainer}>
                    <Ionicons name="people-outline" size={48} color={COLORS.textGray} />
                    <Text style={styles.emptyMembersText}>
                      No hay miembros disponibles en este grupo
                    </Text>
                  </View>
                )}
              </ScrollView>

              <View style={styles.actionsContainer}>
                {selectedMember ? (
                  <>
                    <View style={{ 
                      backgroundColor: COLORS.secondary, 
                      padding: 12, 
                      borderRadius: 8,
                      marginBottom: 12,
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 8
                    }}>
                      <Ionicons name="checkmark-circle" size={20} color={COLORS.primary} />
                      <Text style={{
                        color: COLORS.primary,
                        fontWeight: '600',
                        flex: 1
                      }}>
                        Miembro seleccionado
                      </Text>
                    </View>
                    <Pressable
                      style={[
                        styles.actionButton,
                        styles.confirmButton,
                        loading && { opacity: 0.6 }
                      ]}
                      onPress={() => handleConfirmReplacement(selectedMember)}
                      disabled={loading}
                    >
                      <Ionicons name="checkmark" size={20} color={COLORS.backgroundWhite} />
                      <Text style={styles.confirmButtonText}>
                        {loading ? 'Procesando...' : 'Confirmar Selección'}
                      </Text>
                    </Pressable>
                  </>
                ) : (
                  <View style={{ 
                    backgroundColor: COLORS.borderSecondary, 
                    padding: 12, 
                    borderRadius: 8,
                    marginBottom: 12,
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 8
                  }}>
                    <Ionicons name="information-circle" size={20} color={COLORS.textGray} />
                    <Text style={{
                      color: COLORS.textGray,
                      fontWeight: '600',
                      flex: 1
                    }}>
                      Selecciona un miembro arriba
                    </Text>
                  </View>
                )}

                <Pressable
                  style={[styles.actionButton, styles.cancelButton]}
                  onPress={handleBackFromSelection}
                  disabled={loading}
                >
                  <Text style={styles.cancelButtonText}>Volver</Text>
                </Pressable>
              </View>
            </View>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}
