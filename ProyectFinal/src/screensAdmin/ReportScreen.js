import { useState } from "react";
import { Text, View, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { HeaderScreen, Banner, MenuFooter, ButtonLogin } from "../components";
import { COLORS } from "../components/constants/theme";
import styles from "../components/styles/ReportStyles";

export default function ReportScreen({ navigation }) {
    const [showBanner, setShowBanner] = useState(false);

    const handlePress = (action) => {
        // Handler genérico para prototipado
        if (action === 'export') {
            Alert.alert('Export', 'Export started');
            return;
        }
        if (action === 'filter') {
            Alert.alert('Filters', 'Open filter modal (todo)');
            return;
        }
        if (action === 'viewDetails') {
            navigation.navigate('History');
            return;
        }
        // default
        Alert.alert('Action', String(action));
    };

    return (
        <SafeAreaView edges={["top", "bottom"]} style={styles.container}>
            <HeaderScreen
                title="Reports"
                rightIcon={<Ionicons name="download-outline" size={24} color="black" />}
                onRightPress={() => handlePress('export')}
                onLeftPress={() => navigation.goBack()}
            />

            <View style={styles.bannerContainer}>
                <Banner
                    message="Reporte actualizado"
                    type="success"
                    visible={showBanner}
                    onHide={() => setShowBanner(false)}
                />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {/* Overview */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Overview</Text>
                        <ButtonLogin
                            title="Export"
                            onPress={() => handlePress('export')}
                            icon={<Ionicons name="download-outline" size={20} color="white" />}
                        />
                    </View>

                    <View style={styles.metricsRow}>
                        <View style={styles.metricCard}>
                            <Text style={styles.metricLabel}>Weekly Attendance</Text>
                            <Text style={styles.metricValue}>92%</Text>
                            <Text style={styles.metricSub}>This Week</Text>
                        </View>

                        <View style={styles.metricCard}>
                            <Text style={styles.metricLabel}>Coverage Rate</Text>
                            <Text style={styles.metricValue}>96%</Text>
                            <Text style={styles.metricSub}>Absences covered</Text>
                        </View>

                        <View style={styles.metricCard}>
                            <Text style={styles.metricLabel}>Avg Response Time</Text>
                            <Text style={styles.metricValue}>14m</Text>
                            <Text style={styles.metricSub}>Replacement time</Text>
                        </View>

                        <View style={styles.metricCard}>
                            <Text style={styles.metricLabel}>Reassignments</Text>
                            <Text style={styles.metricValue}>38</Text>
                            <Text style={styles.metricSub}>Last 7 days</Text>
                        </View>
                    </View>
                </View>

                {/* Filters */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Filters</Text>
                        <ButtonLogin
                            title="Adjust"
                            onPress={() => handlePress('filter')}
                            icon={<Ionicons name="filter-outline" size={20} color="white" />}
                        />
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text>This week</Text>
                        <Text>Last 30 Days</Text>
                        <Text>Quarter</Text>
                        <Text>Year</Text>
                    </View>
                </View>

                {/* Attendance Trend */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Attendance Trend</Text>
                        <View style={{ flexDirection: 'row' }}>
                            <ButtonLogin
                                title="Line"
                                onPress={() => handlePress('line')}
                                icon={<Ionicons name="analytics-outline" size={18} color="white" />}
                            />
                            <ButtonLogin
                                title="Bar"
                                onPress={() => handlePress('bar')}
                                icon={<Ionicons name="bar-chart-outline" size={18} color="white" />}
                            />
                        </View>
                    </View>

                    <View>
                        <View style={{ height: 120, backgroundColor: COLORS.backgroundWhite, borderRadius: 8, justifyContent: 'center', alignItems: 'center' }}>
                            <Text>Chart placeholder</Text>
                        </View>
                        <Text style={{ color: COLORS.textGray, marginTop: 6 }}>Shows daily attendance vs target</Text>
                    </View>
                </View>

                {/* Coverage by Team */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Coverage by Team</Text>
                        <ButtonLogin
                            title="View Details"
                            onPress={() => handlePress('viewDetails')}
                        />
                    </View>

                    <View style={styles.teamRow}>
                        <View style={styles.teamItem}>
                            <Text style={styles.teamName}>Front desk</Text>
                            <Text style={styles.teamValue}>98%</Text>
                        </View>
                        <View style={styles.teamItem}>
                            <Text style={styles.teamName}>Kitchen</Text>
                            <Text style={styles.teamValue}>93%</Text>
                        </View>
                        <View style={styles.teamItem}>
                            <Text style={styles.teamName}>Night Ops</Text>
                            <Text style={styles.teamValue}>95%</Text>
                        </View>
                    </View>

                    <View style={{ marginTop: 10 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text style={styles.sectionTitle}>Top Metrics</Text>
                            <ButtonLogin
                                title="Pin"
                                onPress={() => handlePress('pin')}
                                icon={<Ionicons name="pin-outline" size={18} color="white" />}
                            />
                        </View>

                        <View style={styles.metricsRow}>
                            <View style={styles.metricCard}>
                                <Text style={styles.metricLabel}>No-show Rate</Text>
                                <Text style={styles.metricValue}>3%</Text>
                                <Text style={styles.metricSub}>This Month</Text>
                            </View>

                            <View style={styles.metricCard}>
                                <Text style={styles.metricLabel}>Overtime Hours</Text>
                                <Text style={styles.metricValue}>42</Text>
                                <Text style={styles.metricSub}>Last 30 days</Text>
                            </View>

                            <View style={styles.metricCard}>
                                <Text style={styles.metricLabel}>Auto Matches</Text>
                                <Text style={styles.metricValue}>87%</Text>
                                <Text style={styles.metricSub}>All matched replacements</Text>
                            </View>

                            <View style={styles.metricCard}>
                                <Text style={styles.metricLabel}>Manual Overrides</Text>
                                <Text style={styles.metricValue}>12%</Text>
                                <Text style={styles.metricSub}>Of all reassignments</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>

            <View style={styles.footerContainer}>
                <MenuFooter />
            </View>
        </SafeAreaView>
    );
}
