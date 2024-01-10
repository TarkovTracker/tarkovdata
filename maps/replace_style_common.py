import os
import xml.etree.ElementTree as ET

def replace_style(svg_path, new_style_path, output_path):
    # Parse the SVG file
    tree = ET.parse(svg_path)
    root = tree.getroot()

    # Find the style element with id="style_common"
    style_common = root.find(".//*[@id='style_common']")

    if style_common is not None:
        # Read the content of the new style file
        with open(new_style_path, 'r') as new_style_file:
            new_style_content = new_style_file.read()

        # Update the content of style_common with the new style content
        style_common.text = new_style_content

        # Save the modified SVG to the output file
        tree.write(output_path)
        print(f'Successfully replaced style in {svg_path} and saved to {output_path}')
    else:
        print(f'Style with id="style_common" not found in {svg_path}.')

def process_svg_files():
    # Get the directory of the script
    script_directory = os.path.dirname(os.path.realpath(__file__))

    # Loop over all files in the script directory
    for filename in os.listdir(script_directory):
        if filename.endswith(".svg"):
            svg_path = os.path.join(script_directory, filename)

            # Assume new_style.css is in the same directory as the script
            new_style_path = os.path.join(script_directory, 'style_common.css')

            # Assume output files should have "_modified" appended to the original name
            output_path = os.path.join(script_directory, f'{os.path.splitext(filename)[0]}_modified.svg')

            # Process the SVG file
            replace_style(svg_path, new_style_path, output_path)

if __name__ == "__main__":
    process_svg_files()
