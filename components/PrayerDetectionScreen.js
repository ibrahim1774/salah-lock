import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ActivityIndicator,
  NativeModules,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';

const { PoseDetectionModule } = NativeModules;

// Specific labels only — no broad scene terms that match anything
const SINK_KEYWORDS = [
  'sink', 'washbasin', 'washbowl', 'lavabo', 'faucet',
  'plumbing_fixture', 'water_faucet', 'water_tap',
];
const GROUND_KEYWORDS = [
  'carpet', 'rug', 'prayer_rug', 'prayer_mat',
  'mat', 'doormat', 'floor_covering',
];

const checkLabels = (labels, keywords) => {
  return labels.some(({ label }) =>
    keywords.some(kw => label.toLowerCase() === kw || label.toLowerCase().includes(kw))
  );
};

const STEPS = {
  sink: {
    number: '1',
    title: 'Take a photo of the sink',
    subtitle: 'Show where you made wudu',
    keywords: SINK_KEYWORDS,
    errorMsg: "We couldn't detect a sink. Please point your camera at the sink where you made wudu.",
  },
  ground: {
    number: '2',
    title: "Take a photo of where you'll pray",
    subtitle: 'Show your prayer mat or clean spot',
    keywords: GROUND_KEYWORDS,
    errorMsg: "We couldn't detect a suitable prayer surface. Please point at your prayer mat or the floor.",
  },
};

const PrayerDetectionScreen = ({ onComplete, onManualUnlock }) => {
  const [step, setStep] = useState('sink');
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);

  useEffect(() => {
    if (step === 'success') {
      const timer = setTimeout(() => onComplete(), 1500);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const handleCapture = async () => {
    if (!cameraRef.current) return;
    setErrorMsg(null);
    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.4, skipProcessing: true });
      setCapturedPhoto(photo.uri);
    } catch (e) {
      console.error('Capture error:', e);
    }
  };

  const handleRetake = () => {
    setCapturedPhoto(null);
    setErrorMsg(null);
  };

  const handleConfirm = async () => {
    setAnalyzing(true);
    setErrorMsg(null);
    try {
      const currentStep = STEPS[step];
      let passed = false;

      if (PoseDetectionModule?.classifyImage) {
        const result = await PoseDetectionModule.classifyImage(capturedPhoto);
        const labels = (result.labels || []).filter(l => l.confidence >= 0.05);
        console.log('[PrayerDetection] Labels:', labels.map(l => `${l.label}(${l.confidence.toFixed(2)})`).join(', '));
        passed = checkLabels(labels, currentStep.keywords);
      } else {
        // Native module not available — fallback to honor system
        passed = true;
      }

      if (passed) {
        setCapturedPhoto(null);
        setStep(step === 'sink' ? 'ground' : 'success');
      } else {
        setErrorMsg(currentStep.errorMsg);
        setCapturedPhoto(null);
      }
    } catch (e) {
      // On error, don't block the user
      setCapturedPhoto(null);
      setStep(step === 'sink' ? 'ground' : 'success');
    } finally {
      setAnalyzing(false);
    }
  };

  if (!permission) return <View style={styles.container} />;

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <Text style={styles.permissionTitle}>Camera Access Required</Text>
          <Text style={styles.permissionSubtitle}>
            Please allow camera access to verify your prayer preparation.
          </Text>
          <TouchableOpacity style={styles.primaryButton} onPress={requestPermission}>
            <Text style={styles.primaryButtonText}>Allow Camera</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </View>
    );
  }

  if (step === 'success') {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.successContent}>
            <View style={styles.successIcon}>
              <Ionicons name="checkmark" size={48} color="#fff" />
            </View>
            <Text style={styles.successTitle}>MashAllah!</Text>
            <Text style={styles.successSubtitle}>You're ready to pray.</Text>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  const currentStep = STEPS[step];

  // Analyzing overlay
  if (analyzing) {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.successContent}>
            <ActivityIndicator size="large" color="#222" />
            <Text style={styles.analyzingText}>Verifying photo...</Text>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  // Preview screen
  if (capturedPhoto) {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <Text style={styles.stepIndicator}>Step {currentStep.number} of 2</Text>
            <Text style={styles.headerTitle}>{currentStep.title}</Text>
          </View>
          <Image source={{ uri: capturedPhoto }} style={styles.previewImage} />
          <View style={styles.previewActions}>
            <TouchableOpacity style={styles.retakeButton} onPress={handleRetake}>
              <Ionicons name="refresh" size={20} color="#333" />
              <Text style={styles.retakeButtonText}>Retake</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
              <Ionicons name="checkmark" size={20} color="#fff" />
              <Text style={styles.confirmButtonText}>Looks Good</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  // Camera screen
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.stepIndicator}>Step {currentStep.number} of 2</Text>
          <Text style={styles.headerTitle}>{currentStep.title}</Text>
          <Text style={styles.headerSubtitle}>{currentStep.subtitle}</Text>
        </View>

        {errorMsg && (
          <View style={styles.errorBanner}>
            <Ionicons name="alert-circle" size={18} color="#c0392b" />
            <Text style={styles.errorText}>{errorMsg}</Text>
          </View>
        )}

        <View style={styles.cameraContainer}>
          <CameraView ref={cameraRef} style={styles.camera} facing="back" />
        </View>

        <View style={styles.captureRow}>
          <TouchableOpacity style={styles.captureButton} onPress={handleCapture}>
            <View style={styles.captureButtonInner} />
          </TouchableOpacity>
        </View>

      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: '#fff',
    zIndex: 3000,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 12,
    alignItems: 'center',
  },
  stepIndicator: {
    fontSize: 13,
    color: '#888',
    fontWeight: '500',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111',
    textAlign: 'center',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#fdecea',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  errorText: {
    flex: 1,
    fontSize: 14,
    color: '#c0392b',
  },
  cameraContainer: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
    marginVertical: 8,
  },
  camera: {
    flex: 1,
  },
  captureRow: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  captureButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 4,
    borderColor: '#222',
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureButtonInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#222',
  },
  previewImage: {
    flex: 1,
    borderRadius: 20,
    marginVertical: 8,
  },
  previewActions: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 16,
  },
  retakeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#ddd',
  },
  retakeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  confirmButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: '#222',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  analyzingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
  },
  permissionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111',
    textAlign: 'center',
    marginTop: 80,
    marginBottom: 12,
  },
  permissionSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  primaryButton: {
    backgroundColor: '#222',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  successContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#2cb06a',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#111',
    marginBottom: 8,
  },
  successSubtitle: {
    fontSize: 18,
    color: '#666',
  },
});

export default PrayerDetectionScreen;
