import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface VolumeContextType {
  volume: number;
  updateVolume: (newVolume: number) => void;
}

const VolumeContext = createContext<VolumeContextType>({
  volume: 0.5,
  updateVolume: () => {},
});

export const useVolume = () => useContext(VolumeContext);

interface VolumeProviderProps {
  children: ReactNode;
}

export const VolumeProvider: React.FC<VolumeProviderProps> = ({ children }) => {
  const [volume, setVolume] = useState(() => {
    const savedVolume = localStorage.getItem("volume");
    return savedVolume !== null ? Number(savedVolume) : 0.5; // Default volume is 0.5
  });

  const updateVolume = (newVolume: number) => {
    setVolume(newVolume);
    localStorage.setItem("volume", newVolume.toString());
  };

  useEffect(() => {
    localStorage.setItem("volume", volume.toString());
  }, [volume]);

  return (
    <VolumeContext.Provider value={{ volume, updateVolume }}>
      {children}
    </VolumeContext.Provider>
  );
};
