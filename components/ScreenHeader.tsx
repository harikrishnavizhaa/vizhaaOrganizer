import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface ScreenHeaderProps {
    title: string;
    onBack?: () => void;
    rightElement?: React.ReactNode;
}

export default function ScreenHeader({ title, onBack, rightElement }: ScreenHeaderProps) {
    return (
        <View style={styles.header}>
            <View style={styles.leftContainer}>
                {onBack && (
                    <TouchableOpacity onPress={onBack} style={styles.backButton}>
                        <Text style={styles.backIcon}>←</Text>
                    </TouchableOpacity>
                )}
                <Text style={[styles.title, !onBack && styles.titleNoBack]}>{title}</Text>
            </View>
            {rightElement && <View style={styles.rightContainer}>{rightElement}</View>}
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingBottom: 15,
        paddingTop: 10,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    leftContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rightContainer: {

    },
    backButton: {
        padding: 5,
        marginRight: 10,
    },
    backIcon: {
        fontSize: 24,
        color: '#000',
        fontWeight: 'bold',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1E3A5F',
    },
    titleNoBack: {
        marginLeft: 0,
    }
});
