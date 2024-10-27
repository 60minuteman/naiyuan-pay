import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, Alert } from 'react-native';
import { COLORS, FONTS } from '../constants/theme';
import Header from '../components/Header';
import { SwipeListView } from 'react-native-swipe-list-view';
import Modal from 'react-native-modal';
import { useRouter } from 'expo-router';

interface Card {
  id: string;
  lastFourDigits: string;
  cardName: string;
}

const BankCard: React.FC = () => {
  const router = useRouter();
  const [cards, setCards] = useState<Card[]>([
    { id: '1', lastFourDigits: '1234', cardName: 'Visa' },
    { id: '2', lastFourDigits: '5678', cardName: 'Mastercard' },
    { id: '3', lastFourDigits: '9012', cardName: 'American Express' },
  ]);
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [cardToDelete, setCardToDelete] = useState<Card | null>(null);

  const renderCard = ({ item }: { item: Card }) => (
    <View style={styles.cardContainer}>
      <View style={styles.circleContainer}>
        <View style={styles.circle} />
        <Image source={require('../assets/credit-card-icon.png')} style={styles.cardIcon} />
      </View>
      <View style={styles.cardDetails}>
        <Text style={styles.cardName}>{item.cardName}</Text>
        <Text style={styles.cardNumber}>**** **** **** {item.lastFourDigits}</Text>
      </View>
    </View>
  );

  const renderHiddenItem = (data: any, rowMap: any) => (
    <View style={styles.rowBack}>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => {
          setCardToDelete(data.item);
          setDeleteModalVisible(true);
        }}
      >
        <Image source={require('../assets/trash.png')} style={styles.trashIcon} />
      </TouchableOpacity>
    </View>
  );

  const deleteCard = () => {
    if (cardToDelete) {
      setCards(cards.filter(card => card.id !== cardToDelete.id));
    }
    setDeleteModalVisible(false);
    setCardToDelete(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        variant="centered"
        title="Bank & Card"
        showBack={true}
        titleStyle={styles.headerTitle}
        onBackPress={() => router.back()} // Add this line to handle back navigation
      />
      <View style={styles.content}>
        <SwipeListView
          data={cards}
          renderItem={renderCard}
          renderHiddenItem={renderHiddenItem}
          rightOpenValue={-75}
          disableRightSwipe
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.cardList}
        />
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>+ Add Card</Text>
        </TouchableOpacity>
      </View>
      <Modal isVisible={isDeleteModalVisible} onBackdropPress={() => setDeleteModalVisible(false)}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Delete Card</Text>
          <Text style={styles.modalText}>Are you sure you want to delete this card? This action is irreversible.</Text>
          <View style={styles.modalButtons}>
            <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => setDeleteModalVisible(false)}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.modalButton, styles.deleteButton]} onPress={deleteCard}>
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  cardList: {
    flexGrow: 1,
  },
  cardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F7F7',
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    height: 80,
  },
  circleContainer: {
    position: 'relative',
    width: 38,
    height: 38,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  circle: {
    position: 'absolute',
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#4D62CD',
    opacity: 0.1,
  },
  cardIcon: {
    width: 20,
    height: 20,
    tintColor: '#4D62CD',
  },
  cardDetails: {
    flex: 1,
  },
  cardName: {
    fontFamily: 'RedHatDisplay-Bold', // Changed to Bold
    fontSize: 16, // Already 16px, but confirming it here
    color: COLORS.BLACK,
    marginBottom: 5,
  },
  cardNumber: {
    fontFamily: FONTS.SEMIBOLD,
    fontSize: 14,
    color: COLORS.GRAY,
  },
  addButton: {
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginTop: 20,
  },
  addButtonText: {
    fontFamily: FONTS.MEDIUM,
    fontSize: 16,
    color: COLORS.WHITE,
  },
  rowBack: {
    alignItems: 'center',
    backgroundColor: 'red',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingRight: 15,
    borderRadius: 15,
    marginBottom: 10,
    height: 60, // Already 60px, but confirming it here
  },
  deleteButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 75,
    height: 60, // Already 60px, but confirming it here
  },
  trashIcon: {
    width: 24,
    height: 24,
    tintColor: 'white',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 24, // Updated to 24px
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  modalTitle: {
    fontSize: 16, // Changed from 20 to 16
    fontFamily: 'RedHatDisplay-Bold', // Changed to Bold
    marginBottom: 12,
    color: COLORS.BLACK, // Added to ensure consistency
  },
  modalText: {
    fontSize: 16,
    fontFamily: FONTS.REGULAR,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#F3F3F3', // Updated to F3F3F3
  },
  cancelButtonText: {
    fontFamily: FONTS.MEDIUM,
    fontSize: 16,
    color: COLORS.BLACK, // Changed to black for better contrast on light background
  },
  deleteButton: {
    backgroundColor: 'red',
  },
  deleteButtonText: {
    fontFamily: FONTS.MEDIUM,
    fontSize: 16,
    color: COLORS.WHITE,
  },
  headerTitle: {
    fontFamily: 'RedHatDisplay-Bold', // Updated to use Red Hat Display 700 (Bold)
    fontSize: 18,
    color: COLORS.BLACK,
  },
});

export default BankCard;
