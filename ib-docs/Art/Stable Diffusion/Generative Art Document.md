
64 vs 128?

What color palette
# Experimentation
## Stable Diffusion Starting Point
## Aseprite Starting Point

- Slower at generating?
	- We can batch still
- More consistent and higher quality results
- More pixel focused tools
- Lose flexibility from full on model
- Immediate implementing into aseprite
# General Tips

## Settings Setup

### Pixel Art - Checkpoint Agnostic

Sampling Method: DPM++ 2M Karras
Sampling Steps: 20-30
Width: 768
Height: 768
CFG Scale: 7-12



# Stable Diffusion
## Definitions

### Sampling Method

| Method | Speed | Creativity | Image Quality | Recommended Use | Key Characteristics |
|--------|-------|------------|--------------|----------------|---------------------|
| Euler Ancestral | Moderate | High | Good | Artistic, experimental images | Introduces randomness, more diverse results[1] |
| DDIM | Fast | Low | Very Good | Consistent, controlled generations | First sampler for diffusion models, uses implicit discretization[2][3] |
| Heun | Moderate | Moderate | Excellent | Detailed, smooth images | Two-stage predictor-corrector method, more accurate than Euler[1][2] |
| DPM++ 2M Karras | Moderate | Moderate | Excellent | High-quality, professional images | Optimized by Timo Karras, produces cleaner images[1][2] |
| LMS | Moderate | Moderate | Good | Artistic, stylized images | Uses multiple past steps for noise estimation[1][2] |
| DPM++ SDE | Moderate | Moderate | Excellent | High-quality images at lower steps | Uses stochastic differential equations[1][2] |

### CFG Scale

| CFG Scale | Creativity | Prompt Adherence | Image Characteristics | Recommended Use |
|-----------|------------|------------------|----------------------|-----------------|
| 1-3 | Extremely High | Very Low | Highly abstract, unpredictable | Experimental art, random generations |
| 4-6 | High | Low | Loose interpretation, minimal details | Creative exploration, conceptual art |
| 7-9 | Moderate | Balanced | Balanced creativity and accuracy | General image generation, versatile |
| 10-12 | Low | High | Precise details, strong prompt following | Specific concept illustrations |
| 13-16 | Very Low | Very High | Rigid, detailed, near-exact prompt match | Technical illustrations, precise designs |
| 17-30 | Minimal | Extremely High | Potential artifacts, over-processed | Not recommended, quality degrades |

**Optimal Range:** 7-12 for most image generation tasks

**Pro Tips:**
- Default setting: 7
- Adjust based on prompt complexity
- Combine with appropriate sampling methods
- Experiment to find your ideal setting
# Extensions
Generation details and settings CAN be found as original image BUT extension settings DO NOT SAVE.

## Pixel Art
Found under ADetailer, Seed
## Downscale
Unknown

## Color
Custom color palette will be the way to go
### Palette Size
Works great at 32
64 is okay but less consistent
This will be mandatory
Palette size at 8 seems to break things a bit

## Palettize
Found under scripts

# Dreamshaper 8 + Pokemon Lora 

https://civitai.com/models/161280/pokemon-sprite-pixelart-768


## Dreamshaper 8 Guide
## Pokemon Lora Guide

- **No Trigger Word Required**: This model operates without the need for a trigger word.
    
- **Recommended Resolution**: We suggest setting your image resolution to 768x768 and then downscaling it 8 times to 96x96 for optimal results. Any image editing programs will work, but we recommend using [plug-in](https://github.com/mrreplicart/sd-webui-pixelart) for post-processing.
    
- **Pokémon Types:** This model is trained with Pokémon type tags, including `grasstype`, `firetype`, `flyingtype`, `darktype`, `bugtype`, and `ghosttype`.
    
- **Pokemon Recognition:** The model can recognize some Pokemon names, but not every Pokemon.
    
- **Special Forms:** The model has been trained with special form tags such as `gmax` and `mega`.

you can use `gen1` , `gen2` , `gen3` , `gen4` , `gen5` to see different art style.  
you can also use `backside` and `shiny`

## Prompts

<lora:pksp768_V2-1:1> 

https://civitai.com/images/18700450

```
512x512
DPM++ 2M Karras
CFG 7
Steps 30

high quality, best quality, (masterpiece:1.05), front sprite, three-quarter view, (front:1.05), (full body:1.05), pixel, pixelart, (front view, fighting:1.05), (single, solo, alone, individual:1.05), <lora:pksp768_V2-1:0.4>, pokemon, coyote, linoone, masked1.2, hood,  long, thin, lithe, gen3, (darktype, coyote, monster:1.08), black, grey, (darktype:0.95), (creature:0.6), (coyote, black mask, quadruped, black body, lupine:0.95), (white background:1.1)

ugly, text, numbers, watermark, human, humans, (worst quality, low quality:1.05), (monochrome), zombie, watermark, username,patreon username, patreon logo,blurry, (extra fingers, deformed hands, polydactyl:1.05), (multiple, group, duo:1.05), (back, behind, rear view:1.05), (background:1.05)

```

```

```
# Retro Diffusion Stable Diffusion 

"RetroDiffusion32xModel" is for generations around 256x256.
"RetroDiffusion64xModel" file is for generations around 512x512.
"RetroDiffusion128xModel" is for generations around 1024x1024

Guide: https://astropulse.co/#retrodiffusionmodelhowto

## Prompting

### Positives
```
detailed pixel art of ______, pixel art style, pixel art
```

#### Required
```
pixel art
```

### Negatives

#### Recommended
```
muted, dull, hazy, muddy colors, blurry, mutated, deformed, noise, stock image, borders, frame, watermark, text, signature, username, cropped, out of frame
```

# Retro Diffusion Aseprite
https://astropulse.gitbook.io/retro-diffusion/aseprite-extension/retro-diffusion-scripts/generation-menus

Color Palette: AAP-64
Size: 128x128
Scale: 6
Quality: 7
Model: Pixel Art
Modifiers: Front-facing (35), pksp768 (36)

## Loras

### PKSP768
```
70 - Completely Broken
50 - Hit or Miss, mostly miss
35 - Okay
20 - Consistently Okay to good

```

#### Prompts

```
gen3
```

```
firetype
watertype
darktype
grasstype
etc
```

### Game Boy Advance

```
Prompt - anime style,  cute cat, clean shading and Style outlines
Scale - 6
Quality - 7

100 - Broken
50 - Messy
26 - Acceptable to good, pretty clean and good cartoonyness
14 - 
```
### Front Facing

## Prompting

### General 

```
3rd gen pokemon style sprite shading, Has upto 4 colors that follow body curvature. Clean colors that accentuate anatomical features.
```

```
gen 3 pokemon sprite shading
```

```
Anime style
```

```
clean shading with outlines
```

```
In an action pose, at a 3/4 angle, looking at the viewer.
```
### Experiments
```
cute anime style wolf with a rainbow mushroom coming out of its head and big cute eyes, clean shading and outlines
```

```
cute anime style bear with a pastel rainbow  mushroom coming out of its head and big cute eyes.  Smooth shading and strong clean outlines
```

```
a detailed anime style cat with big cute eyes in a playful feline action pose looking at the viewer. smooth shading with clean black outlines.
```

```
Big cute defined eyes with a bright catchlight, crisp white sclera, perfectly defined pupil, clean pixel eye details
```

```
wolf in a  pokemon style gen 3 sprite shading. Has up to 4 base colors that follow body curvature with  Clean colors that accentuate anatomical features.
```