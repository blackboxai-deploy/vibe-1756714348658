'use client';

import { useRef } from 'react';
import { useFrame, extend } from '@react-three/fiber';
import { 
  EffectComposer,
  Bloom,
  DepthOfField,
  Vignette,
  ChromaticAberration,
  Noise,
} from '@react-three/postprocessing';
import { BlendFunction, KernelSize } from 'postprocessing';

// Extend R3F to use post-processing effects
extend({ EffectComposer });

interface PostProcessingEffectsProps {
  enabled: boolean;
}

export function PostProcessingEffects({ enabled }: PostProcessingEffectsProps) {
  const composerRef = useRef();

  useFrame((state) => {
    // Dynamic effect adjustments based on time and camera
    if (composerRef.current) {
      // Could add dynamic parameter changes here
    }
  });

  if (!enabled) return null;

  return (
    <EffectComposer ref={composerRef} multisampling={8}>
      {/* Bloom Effect - for dramatic lighting and glow */}
      <Bloom
        intensity={0.8}
        kernelSize={KernelSize.LARGE}
        luminanceThreshold={0.7}
        luminanceSmoothing={0.9}
        mipmapBlur={true}
        blendFunction={BlendFunction.SCREEN}
      />

      {/* Depth of Field - cinematic focus effect */}
      <DepthOfField
        focusDistance={0.02}
        focalLength={0.05}
        bokehScale={3}
        height={480}
        blendFunction={BlendFunction.NORMAL}
      />

      {/* Vignette - cinematic frame darkening */}
      <Vignette
        offset={0.3}
        darkness={0.8}
        blendFunction={BlendFunction.MULTIPLY}
      />

      {/* Chromatic Aberration - subtle color fringing for realism */}
      <ChromaticAberration
        offset={[0.002, 0.002]}
        blendFunction={BlendFunction.NORMAL}
      />

      {/* Noise - add texture and cinematic feel */}
      <Noise
        premultiply
        blendFunction={BlendFunction.OVERLAY}
      />
    </EffectComposer>
  );
}