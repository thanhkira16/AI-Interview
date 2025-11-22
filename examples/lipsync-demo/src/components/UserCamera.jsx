import React, { useRef, useState, useEffect } from "react";

export const UserCamera = () => {
    const [stream, setStream] = useState(null);
    const [isActive, setIsActive] = useState(false);
    const [error, setError] = useState("");
    const [permissionStatus, setPermissionStatus] = useState("unknown");
    const [isRequestingPermission, setIsRequestingPermission] = useState(false);
    const [micEnabled, setMicEnabled] = useState(true);
    const [cameraEnabled, setCameraEnabled] = useState(true);
    const [speakerEnabled, setSpeakerEnabled] = useState(true);
    const videoRef = useRef();

    // Fixed settings - camera always shows but can be disabled
    const cameraSize = "medium";
    const cameraPosition = "bottom-right";

    // Camera size configurations
    const sizeConfig = {
        small: { width: 200, height: 150 },
        medium: { width: 280, height: 210 },
        large: { width: 400, height: 300 },
    };

    // Position configurations
    const positionConfig = {
        "top-left": { top: "20px", left: "20px" },
        "top-right": { top: "20px", right: "20px" },
        "bottom-left": { bottom: "20px", left: "20px" },
        "bottom-right": { bottom: "20px", right: "20px" },
        "center-overlay": {
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 2000
        },
    };

    // Check camera permission status
    useEffect(() => {
        const checkPermission = async () => {
            try {
                if (navigator.permissions && navigator.permissions.query) {
                    const permission = await navigator.permissions.query({ name: 'camera' });
                    setPermissionStatus(permission.state);

                    // Listen for permission changes
                    permission.addEventListener('change', () => {
                        setPermissionStatus(permission.state);
                    });
                }
            } catch (err) {
                console.log("Permission API not supported");
            }
        };

        checkPermission();
    }, []);

    // Request camera permission
    const requestCameraPermission = async () => {
        setIsRequestingPermission(true);
        setError("");

        try {
            // Test request to trigger permission dialog
            const testStream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 640, max: 640 },
                    height: { ideal: 480, max: 480 },
                    facingMode: "user"
                },
                audio: false
            });

            // Stop test stream immediately
            testStream.getTracks().forEach(track => track.stop());

            setPermissionStatus("granted");
            setIsRequestingPermission(false);

            // Now start the actual camera
            startCamera();

        } catch (err) {
            setIsRequestingPermission(false);

            if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
                setPermissionStatus("denied");
                setError("Camera permission denied. Please allow camera access in your browser settings.");
            } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
                setError("No camera found. Please connect a camera device.");
            } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
                setError("Camera is already in use by another application.");
            } else {
                setError(`Camera error: ${err.message}`);
            }
            console.error("Camera permission error:", err);
        }
    };

    // Start camera with current settings
    const startCamera = async () => {
        try {
            setError("");
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: sizeConfig[cameraSize].width },
                    height: { ideal: sizeConfig[cameraSize].height },
                    facingMode: "user",
                    frameRate: { ideal: 30, max: 30 }
                },
                audio: false
            });

            setStream(mediaStream);
            setIsActive(true);

            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
        } catch (err) {
            console.error("Camera access error:", err);

            if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
                setError("Camera permission denied. Click 'Request Permission' to allow camera access.");
                setPermissionStatus("denied");
            } else {
                setError("Cannot access camera. Please check if camera is available.");
            }
            setIsActive(false);
        }
    };

    // Stop camera
    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
            setIsActive(false);
        }
    };

    // Toggle camera
    const toggleCamera = () => {
        setCameraEnabled(!cameraEnabled);
        if (cameraEnabled) {
            stopCamera();
        } else {
            if (permissionStatus === "granted") {
                startCamera();
            } else {
                requestCameraPermission();
            }
        }
    };

    // Toggle microphone (placeholder for future implementation)
    const toggleMicrophone = () => {
        setMicEnabled(!micEnabled);
        console.log('🎤 Microphone toggled:', !micEnabled);
    };

    // Toggle speaker (placeholder for future implementation)
    const toggleSpeaker = () => {
        setSpeakerEnabled(!speakerEnabled);
        console.log('🔊 Speaker toggled:', !speakerEnabled);
    };

    // Auto-start camera when component mounts
    useEffect(() => {
        // Small delay to ensure component is mounted
        const timer = setTimeout(() => {
            if (cameraEnabled) {
                if (permissionStatus === "granted") {
                    startCamera();
                } else {
                    requestCameraPermission();
                }
            }
        }, 500);

        return () => {
            clearTimeout(timer);
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [cameraEnabled]);

    // Update video source when stream changes
    useEffect(() => {
        if (videoRef.current && stream) {
            videoRef.current.srcObject = stream;
        }
    }, [stream]);

    return (
        <div style={{ position: "fixed", ...positionConfig[cameraPosition], zIndex: 1000 }}>
            {/* Camera Window */}
            <div
                style={{
                    width: `${sizeConfig[cameraSize].width}px`,
                    height: `${sizeConfig[cameraSize].height}px`,
                    border: "3px solid #4a9eff",
                    borderRadius: "16px",
                    overflow: "hidden",
                    boxShadow: "0 4px 16px rgba(74, 158, 255, 0.3)",
                    background: "#1a1a1a",
                    transition: "all 0.3s ease",
                    opacity: cameraEnabled ? 1 : 0.5,
                    marginBottom: "8px",
                }}
            >
                {error && !cameraEnabled ? (
                    // Error state with permission request button
                    <div
                        style={{
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexDirection: "column",
                            color: "#ff6b6b",
                            padding: "16px",
                            textAlign: "center",
                            fontSize: "13px",
                        }}
                    >
                        <div style={{ marginBottom: "12px", fontSize: "28px" }}>
                            {permissionStatus === "denied" ? "🔒" : "⚠️"}
                        </div>
                        <div style={{ marginBottom: "12px", lineHeight: "1.4" }}>{error}</div>

                        {(permissionStatus === "denied" || permissionStatus === "unknown") && (
                            <button
                                onClick={requestCameraPermission}
                                disabled={isRequestingPermission}
                                style={{
                                    background: isRequestingPermission
                                        ? "rgba(74, 158, 255, 0.6)"
                                        : "rgba(74, 158, 255, 0.8)",
                                    color: "white",
                                    border: "none",
                                    padding: "8px 16px",
                                    borderRadius: "8px",
                                    cursor: isRequestingPermission ? "wait" : "pointer",
                                    fontSize: "12px",
                                    fontWeight: "500",
                                    transition: "all 0.2s ease",
                                }}
                                onMouseOver={(e) => !isRequestingPermission &&
                                    (e.target.style.background = "rgba(74, 158, 255, 1)")}
                                onMouseOut={(e) => !isRequestingPermission &&
                                    (e.target.style.background = "rgba(74, 158, 255, 0.8)")}
                            >
                                {isRequestingPermission ? "Requesting..." : "Request Permission"}
                            </button>
                        )}
                    </div>
                ) : !cameraEnabled ? (
                    // Camera disabled state
                    <div
                        style={{
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#888",
                            fontSize: "48px",
                        }}
                    >
                        📷
                    </div>
                ) : (
                    // Video stream
                    <>
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                transform: "scaleX(-1)", // Mirror effect
                                background: "#000",
                            }}
                        />

                        {/* Camera controls overlay */}
                        <div
                            style={{
                                position: "absolute",
                                bottom: "8px",
                                left: "8px",
                                right: "8px",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            {/* Status indicator */}
                            <div
                                style={{
                                    background: "rgba(0, 0, 0, 0.7)",
                                    color: "white",
                                    padding: "4px 8px",
                                    borderRadius: "12px",
                                    fontSize: "12px",
                                    fontFamily: "monospace",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "4px",
                                }}
                            >
                                <div
                                    style={{
                                        width: "8px",
                                        height: "8px",
                                        borderRadius: "50%",
                                        backgroundColor: isActive ? "#4ade80" : "#ef4444",
                                    }}
                                />
                                {isActive ? "Live" : "Offline"}
                            </div>

                            {/* Camera info */}
                            <div
                                style={{
                                    background: "rgba(0, 0, 0, 0.7)",
                                    color: "white",
                                    padding: "4px 8px",
                                    borderRadius: "12px",
                                    fontSize: "11px",
                                    fontFamily: "monospace",
                                }}
                            >
                                {sizeConfig[cameraSize].width}x{sizeConfig[cameraSize].height}
                            </div>
                        </div>

                        {/* Loading indicator when starting */}
                        {!isActive && !error && (
                            <div
                                style={{
                                    position: "absolute",
                                    top: "50%",
                                    left: "50%",
                                    transform: "translate(-50%, -50%)",
                                    color: "white",
                                    fontSize: "14px",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                }}
                            >
                                <div
                                    style={{
                                        width: "20px",
                                        height: "20px",
                                        border: "2px solid #4a9eff",
                                        borderTop: "2px solid transparent",
                                        borderRadius: "50%",
                                        animation: "spin 1s linear infinite",
                                    }}
                                />
                                Starting...
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Control Buttons */}
            <div
                style={{
                    display: "flex",
                    gap: "8px",
                    justifyContent: "center",
                }}
            >
                {/* Microphone Button */}
                <button
                    onClick={toggleMicrophone}
                    style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "12px",
                        border: "none",
                        background: micEnabled ? "#4ade80" : "#ef4444",
                        color: "white",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "18px",
                        transition: "all 0.2s ease",
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
                        position: "relative",
                    }}
                    onMouseOver={(e) => e.target.style.transform = "scale(1.05)"}
                    onMouseOut={(e) => e.target.style.transform = "scale(1)"}
                    title={micEnabled ? "Tắt microphone" : "Bật microphone"}
                >
                    🎤
                    {!micEnabled && (
                        <div
                            style={{
                                position: "absolute",
                                width: "2px",
                                height: "24px",
                                background: "white",
                                transform: "rotate(45deg)",
                            }}
                        />
                    )}
                </button>

                {/* Camera Button */}
                <button
                    onClick={toggleCamera}
                    style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "12px",
                        border: "none",
                        background: cameraEnabled ? "#4ade80" : "#ef4444",
                        color: "white",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "18px",
                        transition: "all 0.2s ease",
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
                        position: "relative",
                    }}
                    onMouseOver={(e) => e.target.style.transform = "scale(1.05)"}
                    onMouseOut={(e) => e.target.style.transform = "scale(1)"}
                    title={cameraEnabled ? "Tắt camera" : "Bật camera"}
                >
                    📷
                    {!cameraEnabled && (
                        <div
                            style={{
                                position: "absolute",
                                width: "2px",
                                height: "24px",
                                background: "white",
                                transform: "rotate(45deg)",
                            }}
                        />
                    )}
                </button>

                {/* Speaker Button */}
                <button
                    onClick={toggleSpeaker}
                    style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "12px",
                        border: "none",
                        background: speakerEnabled ? "#4ade80" : "#ef4444",
                        color: "white",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "18px",
                        transition: "all 0.2s ease",
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
                        position: "relative",
                    }}
                    onMouseOver={(e) => e.target.style.transform = "scale(1.05)"}
                    onMouseOut={(e) => e.target.style.transform = "scale(1)"}
                    title={speakerEnabled ? "Tắt loa" : "Bật loa"}
                >
                    🔊
                    {!speakerEnabled && (
                        <div
                            style={{
                                position: "absolute",
                                width: "2px",
                                height: "24px",
                                background: "white",
                                transform: "rotate(45deg)",
                            }}
                        />
                    )}
                </button>
            </div>

            {/* CSS Animation for loading spinner */}
            <style jsx>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};