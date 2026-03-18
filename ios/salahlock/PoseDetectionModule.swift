import Foundation
import Vision
import UIKit

@objc(PoseDetectionModule)
class PoseDetectionModule: NSObject {

    @objc static func requiresMainQueueSetup() -> Bool {
        return false
    }

    @objc func analyzePose(_ imageUri: String, resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        // Load image from file URI
        let filePath = imageUri.hasPrefix("file://") ? String(imageUri.dropFirst(7)) : imageUri
        guard let uiImage = UIImage(contentsOfFile: filePath),
              let cgImage = uiImage.cgImage else {
            resolve(["detected": false, "reason": "Could not load image"])
            return
        }

        let request = VNDetectHumanBodyPoseRequest()
        let handler = VNImageRequestHandler(cgImage: cgImage, options: [:])

        do {
            try handler.perform([request])
            guard let observation = request.results?.first else {
                resolve(["detected": false, "reason": "No person detected"])
                return
            }

            // Collect key joints for prayer pose analysis
            // Vision coordinate system: (0,0) = bottom-left, (1,1) = top-right
            // Y increases upward (opposite of screen coordinates)
            var joints: [String: [String: Double]] = [:]

            let jointNames: [(VNHumanBodyPoseObservation.JointName, String)] = [
                (.nose, "nose"),
                (.neck, "neck"),
                (.leftShoulder, "leftShoulder"),
                (.rightShoulder, "rightShoulder"),
                (.leftHip, "leftHip"),
                (.rightHip, "rightHip"),
                (.leftKnee, "leftKnee"),
                (.rightKnee, "rightKnee"),
                (.leftAnkle, "leftAnkle"),
                (.rightAnkle, "rightAnkle"),
                (.root, "root"),
            ]

            for (jointName, key) in jointNames {
                if let point = try? observation.recognizedPoint(jointName), point.confidence > 0.3 {
                    joints[key] = ["x": Double(point.location.x), "y": Double(point.location.y), "confidence": Double(point.confidence)]
                }
            }

            resolve(["detected": !joints.isEmpty, "joints": joints])
        } catch {
            resolve(["detected": false, "reason": "Detection error: \(error.localizedDescription)"])
        }
    }

    @objc func classifyImage(_ imageUri: String, resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        let filePath = imageUri.hasPrefix("file://") ? String(imageUri.dropFirst(7)) : imageUri
        guard let uiImage = UIImage(contentsOfFile: filePath),
              let cgImage = uiImage.cgImage else {
            resolve(["labels": []])
            return
        }

        let request = VNClassifyImageRequest()
        let handler = VNImageRequestHandler(cgImage: cgImage, options: [:])

        do {
            try handler.perform([request])
            let observations = request.results ?? []
            // Return all labels with confidence above 1% so JS can check them
            let labels = observations
                .filter { $0.confidence > 0.01 }
                .map { ["label": $0.identifier, "confidence": Double($0.confidence)] }
            resolve(["labels": labels])
        } catch {
            resolve(["labels": []])
        }
    }
}
