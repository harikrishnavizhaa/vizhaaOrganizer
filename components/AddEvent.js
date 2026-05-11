import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput,
  TouchableOpacity, Modal, Dimensions, FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const EVENT_TYPES = [
  { id: 'wedding',   label: 'Wedding',   icon: 'ring' },
  { id: 'corporate', label: 'Corporate', icon: 'briefcase' },
  { id: 'birthday',  label: 'Birthday',  icon: 'birthday-cake' },
  { id: 'other',     label: 'Other',     icon: 'ellipsis-h' },
];

const DRESS_CODES = [
  { id: 'white_shirt',  label: 'White Shirt',  icon: 'tshirt', color: '#FFFFFF' },
  { id: 'black_shirt',  label: 'Black Shirt',  icon: 'tshirt', color: '#222222' },
  { id: 'white_tshirt', label: 'White T-Shirt', icon: 'tshirt', color: '#FFFDE7' },
  { id: 'black_tshirt', label: 'Black T-Shirt', icon: 'tshirt', color: '#424242' },
  { id: 'other',        label: 'Other',         icon: 'ellipsis-h', color: '#9E9E9E' },
];

const SERVICES = [
  { id: 'breakfast', label: 'Breakfast', icon: 'coffee' },
  { id: 'lunch',     label: 'Lunch',     icon: 'utensils' },
  { id: 'dinner',    label: 'Dinner',    icon: 'moon' },
  { id: 'snacks',    label: 'Snacks',    icon: 'cookie' },
];

const HOURS   = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
const MINUTES = ['00', '15', '30', '45'];
const PERIODS = ['AM', 'PM'];

// ─── Custom Calendar ──────────────────────────────────────────────────────────
const MONTH_NAMES = ['January','February','March','April','May','June',
                     'July','August','September','October','November','December'];
const DAY_NAMES   = ['Su','Mo','Tu','We','Th','Fr','Sa'];

function CalendarPicker({ visible, onClose, onSelect }) {
  const today = new Date();
  const [year,  setYear]  = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = Array.from({ length: firstDay + daysInMonth }, (_, i) =>
    i < firstDay ? null : i - firstDay + 1
  );
  while (cells.length % 7 !== 0) cells.push(null);

  const prevMonth = () => { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); };
  const nextMonth = () => { if (month === 11) { setMonth(0);  setYear(y => y + 1); } else setMonth(m => m + 1); };

  return (
    <Modal transparent visible={visible} animationType="fade">
      <TouchableOpacity style={cal.overlay} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity activeOpacity={1} style={cal.box}>
          <View style={cal.header}>
            <TouchableOpacity onPress={prevMonth} style={cal.navBtn}>
              <Ionicons name="chevron-back" size={20} color="#2C1206" />
            </TouchableOpacity>
            <Text style={cal.monthText}>{MONTH_NAMES[month]} {year}</Text>
            <TouchableOpacity onPress={nextMonth} style={cal.navBtn}>
              <Ionicons name="chevron-forward" size={20} color="#2C1206" />
            </TouchableOpacity>
          </View>
          <View style={cal.dayRow}>
            {DAY_NAMES.map(d => <Text key={d} style={cal.dayName}>{d}</Text>)}
          </View>
          <View style={cal.grid}>
            {cells.map((day, idx) => (
              <TouchableOpacity
                key={idx}
                style={[cal.cell, day ? cal.activeCell : cal.emptyCell]}
                onPress={() => day && onSelect(
                  `${String(day).padStart(2,'0')}/${String(month+1).padStart(2,'0')}/${year}`
                )}
                disabled={!day}
              >
                {day ? <Text style={cal.cellText}>{day}</Text> : null}
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity style={cal.closeBtn} onPress={onClose}>
            <Text style={cal.closeBtnText}>Cancel</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const cal = StyleSheet.create({
  overlay:   { flex:1, backgroundColor:'rgba(0,0,0,0.45)', justifyContent:'center', alignItems:'center' },
  box:       { backgroundColor:'#FFF', borderRadius:20, padding:20, width: width - 50, shadowColor:'#000', shadowOpacity:0.2, shadowRadius:15, elevation:10 },
  header:    { flexDirection:'row', alignItems:'center', justifyContent:'space-between', marginBottom:14 },
  navBtn:    { padding:6, backgroundColor:'#F5F5F5', borderRadius:8 },
  monthText: { fontSize:16, fontFamily:'Outfit_700Bold', color:'#2C1206' },
  dayRow:    { flexDirection:'row', marginBottom:6 },
  dayName:   { flex:1, textAlign:'center', fontSize:12, fontFamily:'Outfit_600SemiBold', color:'#999' },
  grid:      { flexDirection:'row', flexWrap:'wrap' },
  cell:      { width:'14.28%', aspectRatio:1, justifyContent:'center', alignItems:'center', marginVertical:2 },
  activeCell:{ },
  emptyCell: { },
  cellText:  { fontSize:13, fontFamily:'Outfit_400Regular', color:'#2C1206' },
  closeBtn:  { marginTop:14, alignItems:'center', paddingVertical:10, backgroundColor:'#F5F5F5', borderRadius:10 },
  closeBtnText: { fontSize:14, fontFamily:'Outfit_700Bold', color:'#7B3F00' },
});

// ─── Time Picker ──────────────────────────────────────────────────────────────
function TimePicker({ visible, onClose, onSelect }) {
  const [hh, setHh] = useState('10');
  const [mm, setMm] = useState('00');
  const [pp, setPp] = useState('AM');

  const Col = ({ data, selected, onPick }) => (
    <FlatList
      data={data}
      keyExtractor={i => i}
      showsVerticalScrollIndicator={false}
      style={{ maxHeight: 160 }}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => onPick(item)}
          style={[tp.colItem, item === selected && tp.colItemActive]}>
          <Text style={[tp.colText, item === selected && tp.colTextActive]}>{item}</Text>
        </TouchableOpacity>
      )}
    />
  );

  return (
    <Modal transparent visible={visible} animationType="fade">
      <TouchableOpacity style={cal.overlay} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity activeOpacity={1} style={[cal.box, { paddingBottom: 10 }]}>
          <Text style={[cal.monthText, { textAlign:'center', marginBottom:16 }]}>Select Time</Text>
          <View style={tp.row}>
            <View style={tp.colWrap}><Text style={tp.colLabel}>Hour</Text><Col data={HOURS}   selected={hh} onPick={setHh}/></View>
            <Text style={tp.sep}>:</Text>
            <View style={tp.colWrap}><Text style={tp.colLabel}>Min</Text><Col data={MINUTES} selected={mm} onPick={setMm}/></View>
            <View style={tp.colWrap}><Text style={tp.colLabel}>  </Text><Col data={PERIODS} selected={pp} onPick={setPp}/></View>
          </View>
          <TouchableOpacity style={[cal.closeBtn, { backgroundColor:'#7B3F00', marginTop:16 }]}
            onPress={() => { onSelect(`${hh}:${mm} ${pp}`); onClose(); }}>
            <Text style={[cal.closeBtnText, { color:'#FFF' }]}>Confirm</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[cal.closeBtn, { marginTop:6 }]} onPress={onClose}>
            <Text style={cal.closeBtnText}>Cancel</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const tp = StyleSheet.create({
  row:          { flexDirection:'row', alignItems:'center', justifyContent:'center' },
  colWrap:      { alignItems:'center', marginHorizontal:8 },
  colLabel:     { fontSize:12, fontFamily:'Outfit_600SemiBold', color:'#999', marginBottom:4 },
  colItem:      { paddingVertical:8, paddingHorizontal:14, borderRadius:8, marginVertical:2 },
  colItemActive:{ backgroundColor:'#2C1206' },
  colText:      { fontSize:15, fontFamily:'Outfit_400Regular', color:'#2C1206' },
  colTextActive:{ color:'#FFD700', fontFamily:'Outfit_700Bold' },
  sep:          { fontSize:22, fontFamily:'Outfit_700Bold', color:'#2C1206', marginBottom:4, alignSelf:'center' },
});

// ─── Main Component ───────────────────────────────────────────────────────────
const AddEvent = ({ onBack, onProceed }) => {
  const [eventName,      setEventName]      = useState('');
  const [location,       setLocation]       = useState('');
  const [date,           setDate]           = useState('');
  const [inTime,         setInTime]         = useState('');
  const [outTime,        setOutTime]        = useState('');
  const [suppliers,      setSuppliers]      = useState('1');
  const [eventType,      setEventType]      = useState('wedding');
  const [otherEventType, setOtherEventType] = useState('');
  const [dressCode,      setDressCode]      = useState('white_shirt');
  const [otherDress,     setOtherDress]     = useState('');
  const [selectedSvcs,   setSelectedSvcs]   = useState([]);
  const [costPerHead,    setCostPerHead]    = useState('');

  const [showCal,     setShowCal]     = useState(false);
  const [showInTime,  setShowInTime]  = useState(false);
  const [showOutTime, setShowOutTime] = useState(false);

  const toggleSvc = (id) =>
    setSelectedSvcs(p => p.includes(id) ? p.filter(s => s !== id) : [...p, id]);

  const totalCost = (parseFloat(costPerHead) || 0) * (parseInt(suppliers) || 0);

  return (
    <SafeAreaView style={s.container}>
      {/* ── Header ── */}
      <View style={s.headerRow}>
        <TouchableOpacity style={s.backBtn} onPress={onBack}>
          <Ionicons name="chevron-back" size={22} color="#2C1206" />
        </TouchableOpacity>
        <View style={s.headerCenter}>
          <MaterialCommunityIcons name="party-popper" size={22} color="#FFD700" />
          <Text style={s.headerTitle}>EVENT DETAILS</Text>
          <MaterialCommunityIcons name="star-face" size={22} color="#FFD700" />
        </View>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>
        <View style={s.form}>

          {/* Event Name */}
          <Field label="Event Name">
            <TextInput style={s.input} placeholder="e.g. Vijay's Wedding Event"
              placeholderTextColor="#BBB" value={eventName} onChangeText={setEventName} />
          </Field>

          {/* Event Type */}
          <Field label="Event Type">
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {EVENT_TYPES.map(t => (
                <TouchableOpacity key={t.id}
                  style={[s.typeCard, eventType === t.id && s.activeCard]}
                  onPress={() => setEventType(t.id)}>
                  <View style={[s.iconBox, eventType === t.id && s.iconBoxActive]}>
                    <FontAwesome5 name={t.icon} size={22} color={eventType === t.id ? '#FFD700' : '#888'} />
                  </View>
                  <Text style={s.typeLabel}>{t.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            {eventType === 'other' && (
              <TextInput style={[s.input, { marginTop: 10 }]}
                placeholder="Describe your event type…"
                placeholderTextColor="#BBB"
                value={otherEventType}
                onChangeText={setOtherEventType} />
            )}
          </Field>

          {/* Location */}
          <Field label="Location">
            <View style={s.inputIcon}>
              <Ionicons name="location-outline" size={18} color="#B08040" style={s.inputIconImg} />
              <TextInput style={[s.input, s.inputWithIcon]}
                placeholder="e.g. Event Venue Address"
                placeholderTextColor="#BBB" value={location} onChangeText={setLocation} />
            </View>
          </Field>

          {/* Date */}
          <Field label="Date">
            <TouchableOpacity style={s.pickerBtn} onPress={() => setShowCal(true)}>
              <Ionicons name="calendar-outline" size={18} color="#B08040" />
              <Text style={[s.pickerText, !date && s.placeholder]}>
                {date || 'DD / MM / YYYY'}
              </Text>
            </TouchableOpacity>
          </Field>

          {/* Times */}
          <View style={s.row}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <Field label="In Time">
                <TouchableOpacity style={s.pickerBtn} onPress={() => setShowInTime(true)}>
                  <Ionicons name="time-outline" size={18} color="#B08040" />
                  <Text style={[s.pickerText, !inTime && s.placeholder]}>
                    {inTime || 'HH:MM AM/PM'}
                  </Text>
                </TouchableOpacity>
              </Field>
            </View>
            <View style={{ flex: 1, marginLeft: 8 }}>
              <Field label="Out Time">
                <TouchableOpacity style={s.pickerBtn} onPress={() => setShowOutTime(true)}>
                  <Ionicons name="time-outline" size={18} color="#B08040" />
                  <Text style={[s.pickerText, !outTime && s.placeholder]}>
                    {outTime || 'HH:MM AM/PM'}
                  </Text>
                </TouchableOpacity>
              </Field>
            </View>
          </View>

          {/* Suppliers */}
          <Field label="Number of Suppliers">
            <TextInput style={s.input} placeholder="e.g. 50" keyboardType="numeric"
              placeholderTextColor="#BBB" value={suppliers} onChangeText={setSuppliers} />
          </Field>

          {/* Dress Code */}
          <Field label="Dress Code">
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {DRESS_CODES.map(dc => (
                <TouchableOpacity key={dc.id}
                  style={[s.typeCard, dressCode === dc.id && s.activeCard]}
                  onPress={() => setDressCode(dc.id)}>
                  <View style={[s.iconBox, dressCode === dc.id && s.iconBoxActive]}>
                    <FontAwesome5 name={dc.icon} size={22} color={dressCode === dc.id ? '#FFD700' : '#888'} />
                  </View>
                  <Text style={s.typeLabel}>{dc.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            {dressCode === 'other' && (
              <TextInput style={[s.input, { marginTop: 10 }]}
                placeholder="Describe your dress code…"
                placeholderTextColor="#BBB"
                value={otherDress}
                onChangeText={setOtherDress} />
            )}
          </Field>

          {/* Services */}
          <Field label="Select Services">
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {SERVICES.map(sv => (
                <TouchableOpacity key={sv.id}
                  style={[s.typeCard, selectedSvcs.includes(sv.id) && s.activeCard]}
                  onPress={() => toggleSvc(sv.id)}>
                  <View style={[s.iconBox, selectedSvcs.includes(sv.id) && s.iconBoxActive]}>
                    <FontAwesome5 name={sv.icon} size={22}
                      color={selectedSvcs.includes(sv.id) ? '#FFD700' : '#888'} />
                  </View>
                  <Text style={s.typeLabel}>{sv.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Field>

          {/* Cost per head */}
          <Field label="Estimated Cost per Head (₹)">
            <View style={s.inputIcon}>
              <Text style={[s.inputIconImg, { fontSize: 16, color: '#B08040', fontFamily:'Outfit_700Bold' }]}>₹</Text>
              <TextInput style={[s.input, s.inputWithIcon]}
                placeholder="Amount per supplier"
                placeholderTextColor="#BBB"
                keyboardType="numeric"
                value={costPerHead}
                onChangeText={setCostPerHead} />
            </View>
          </Field>

          {/* Cost Summary Card */}
          <View style={s.costCard}>
            <LinearGradient colors={['#2C1206', '#5C2A0E']} style={s.costHeader}>
              <Text style={s.costHeaderText}>Cost Summary</Text>
            </LinearGradient>
            <View style={s.costBody}>
              <CostRow label="Services selected"  value={`${selectedSvcs.length}`} unit="" />
              <CostRow label="Suppliers"           value={suppliers || '0'} unit="" />
              <CostRow label="Cost per head"       value={costPerHead ? `₹${costPerHead}` : '—'} unit="" />
              <View style={s.divider} />
              <CostRow label="Total Estimate"      value={totalCost > 0 ? `₹${totalCost.toLocaleString()}` : '—'} bold />
              {totalCost > 0 && (
                <>
                  <View style={s.advanceBar}>
                    <Text style={s.advLbl}>Advance (25%)</Text>
                    <Text style={s.advVal}>₹{(totalCost * 0.25).toLocaleString()}</Text>
                  </View>
                  <Text style={s.balText}>Balance after event : ₹{(totalCost * 0.75).toLocaleString()}</Text>
                </>
              )}

              <Field label="Coupon Code" noMargin>
                <TextInput style={s.couponInput}
                  placeholder="Enter Vizhaa voucher code"
                  placeholderTextColor="#BBB" />
              </Field>

              <TouchableOpacity style={s.payBtn}
                onPress={() => onProceed({ eventName, location, date, inTime, outTime,
                  suppliers, eventType: eventType === 'other' ? otherEventType : eventType,
                  dressCode: dressCode === 'other' ? otherDress : dressCode,
                  selectedSvcs, costPerHead })}>
                <Text style={s.payBtnText}>Proceed to Payment</Text>
                <Ionicons name="arrow-forward" size={18} color="#FFF" style={{ marginLeft: 8 }} />
              </TouchableOpacity>
            </View>
          </View>

        </View>
      </ScrollView>

      {/* Modals */}
      <CalendarPicker visible={showCal} onClose={() => setShowCal(false)}
        onSelect={d => { setDate(d); setShowCal(false); }} />
      <TimePicker visible={showInTime}  onClose={() => setShowInTime(false)}
        onSelect={t => setInTime(t)} />
      <TimePicker visible={showOutTime} onClose={() => setShowOutTime(false)}
        onSelect={t => setOutTime(t)} />
    </SafeAreaView>
  );
};

const Field = ({ label, children, noMargin }) => (
  <View style={[s.inputGroup, noMargin && { marginBottom: 0 }]}>
    {label ? <Text style={s.label}>{label}</Text> : null}
    {children}
  </View>
);

const CostRow = ({ label, value, unit, bold }) => (
  <View style={s.costRow}>
    <Text style={[s.costLbl, bold && { fontFamily:'Outfit_700Bold', fontSize: 15 }]}>{label}</Text>
    <Text style={[s.costVal, bold && { fontFamily:'Outfit_700Bold', fontSize: 18, color:'#2C1206' }]}>
      {value}{unit}
    </Text>
  </View>
);

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F4F4' },

  /* Header */
  headerRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 14,
    backgroundColor: '#FFF',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 6, elevation: 4,
  },
  backBtn: {
    width: 38, height: 38, borderRadius: 12,
    backgroundColor: '#F5EFE6', justifyContent: 'center', alignItems: 'center',
  },
  headerCenter: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  headerTitle: {
    fontSize: 18, fontFamily: 'Outfit_700Bold', color: '#2C1206', marginHorizontal: 6,
  },

  /* Scroll */
  scroll: { paddingBottom: 50, paddingTop: 8 },
  form:   { paddingHorizontal: 18 },

  /* Inputs */
  inputGroup: { marginBottom: 22 },
  label:      { fontSize: 15, fontFamily: 'Outfit_700Bold', color: '#2C1206', marginBottom: 8 },
  input: {
    backgroundColor: '#FFF', height: 52, borderRadius: 12, paddingHorizontal: 14,
    fontSize: 14, fontFamily: 'Outfit_400Regular', color: '#333',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },

  inputIcon:     { flexDirection: 'row', alignItems: 'center' },
  inputIconImg:  { position: 'absolute', left: 14, zIndex: 1 },
  inputWithIcon: { flex: 1, paddingLeft: 38 },

  pickerBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: '#FFF', height: 52, borderRadius: 12, paddingHorizontal: 14,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  pickerText: { fontSize: 14, fontFamily: 'Outfit_400Regular', color: '#333' },
  placeholder: { color: '#BBB' },

  row: { flexDirection: 'row' },

  /* Type / Dress Cards */
  typeCard: {
    width: 84, backgroundColor: '#FFF', borderRadius: 14, padding: 10,
    marginRight: 10, alignItems: 'center',
    borderWidth: 1.5, borderColor: 'transparent',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  activeCard:    { borderColor: '#FFD700' },
  iconBox:       { width: 54, height: 54, borderRadius: 12, backgroundColor: '#F5F5F5', justifyContent:'center', alignItems:'center', marginBottom: 6 },
  iconBoxActive: { backgroundColor: '#2C1206' },
  typeLabel:     { fontSize: 10, fontFamily: 'Outfit_600SemiBold', color: '#2C1206', textAlign:'center' },

  /* Cost Card */
  costCard:   { backgroundColor: '#FFF', borderRadius: 20, marginTop: 4, overflow: 'hidden', shadowColor:'#000', shadowOffset:{width:0,height:5}, shadowOpacity:0.1, shadowRadius:15, elevation:5 },
  costHeader: { paddingVertical: 16, paddingHorizontal: 20 },
  costHeaderText: { fontSize: 16, fontFamily: 'Outfit_700Bold', color: '#FFF' },
  costBody:   { padding: 20 },
  costRow:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  costLbl:    { fontSize: 13, fontFamily: 'Outfit_400Regular', color: '#666' },
  costVal:    { fontSize: 13, fontFamily: 'Outfit_600SemiBold', color: '#444' },
  divider:    { height: 1, backgroundColor: '#EEE', marginVertical: 12 },

  advanceBar: {
    flexDirection: 'row', justifyContent: 'space-between',
    backgroundColor: '#FFF9E6', padding: 14, borderRadius: 10, marginBottom: 6,
  },
  advLbl: { fontSize: 13, fontFamily: 'Outfit_700Bold', color: '#2C1206' },
  advVal: { fontSize: 14, fontFamily: 'Outfit_700Bold', color: '#2C1206' },
  balText:{ fontSize: 11, fontFamily: 'Outfit_400Regular', color: '#888', textAlign: 'right', marginBottom: 18 },

  couponInput: {
    height: 48, borderRadius: 10, paddingHorizontal: 14,
    borderWidth: 1, borderColor: '#EEE',
    fontSize: 13, fontFamily: 'Outfit_400Regular', color: '#333',
    backgroundColor: '#FAFAFA',
  },

  payBtn: {
    flexDirection: 'row', backgroundColor: '#7B3F00',
    height: 54, borderRadius: 14, justifyContent: 'center', alignItems: 'center',
    marginTop: 18,
    shadowColor: '#7B3F00', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 8, elevation: 6,
  },
  payBtnText: { color: '#FFF', fontSize: 15, fontFamily: 'Outfit_700Bold' },
});

export default AddEvent;
