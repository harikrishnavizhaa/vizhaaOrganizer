import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../src/theme/colors';

interface Step {
    label: string;
    completed: boolean;
    active: boolean;
    time?: string;
}

interface StatusStepsProps {
    currentStatus: string; // 'upcoming', 'assigned', 'arrived', 'started', 'completed'
}

export default function StatusSteps({ currentStatus }: StatusStepsProps) {
    const steps: Step[] = [
        { label: 'Event Created', completed: true, active: false },
        { label: 'Staff Assigned', completed: false, active: false },
        { label: 'Staff Arrived', completed: false, active: false },
        { label: 'Event Started', completed: false, active: false },
        { label: 'Event Completed', completed: false, active: false },
    ];

    let activeIndex = 0;
    if (currentStatus === 'assigned') activeIndex = 1;
    if (currentStatus === 'arrived') activeIndex = 2;
    if (currentStatus === 'started') activeIndex = 3;
    if (currentStatus === 'completed') activeIndex = 4;

    const computedSteps = steps.map((step, index) => ({
        ...step,
        completed: index <= activeIndex,
        active: index === activeIndex
    }));

    return (
        <View style={styles.container}>
            {computedSteps.map((step, index) => (
                <View key={index} style={styles.stepRow}>
                    <View style={styles.indicatorContainer}>
                        <View style={[
                            styles.circle,
                            step.completed && { backgroundColor: colors.success, borderColor: colors.success },
                            step.active && { borderColor: colors.primary, backgroundColor: 'transparent' }
                        ]}>
                            {step.completed && <Ionicons name="checkmark" size={12} color="#fff" />}
                            {step.active && <View style={styles.pulse} />}
                        </View>
                        {index < computedSteps.length - 1 && (
                            <View style={[styles.line, step.completed && { backgroundColor: colors.success }]} />
                        )}
                    </View>

                    <View style={styles.textContainer}>
                        <Text style={[
                            styles.label,
                            step.completed && { color: '#FFF', fontWeight: '600' },
                            step.active && { color: colors.primary, fontWeight: '800', fontSize: 16 }
                        ]}>
                            {step.label}
                        </Text>
                        {step.active && <Text style={styles.activeTag}>Current Stage</Text>}
                    </View>
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 10,
    },
    stepRow: {
        flexDirection: 'row',
        height: 70,
    },
    indicatorContainer: {
        alignItems: 'center',
        marginRight: 20,
        width: 30,
    },
    circle: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
    pulse: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: colors.primary,
    },
    line: {
        width: 2,
        flex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        marginTop: -1,
        marginBottom: -1,
    },
    textContainer: {
        flex: 1,
        justifyContent: 'flex-start',
        paddingTop: 2,
    },
    label: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.4)',
    },
    activeTag: {
        fontSize: 11,
        color: colors.primary,
        fontWeight: '800',
        marginTop: 4,
        textTransform: 'uppercase',
        letterSpacing: 1,
    }
});
