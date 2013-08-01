cd chart
"C:\Program Files\7-Zip\7z.exe" a -mx9 -r -tzip ..\chart.wgt *.* -x!README.md
cd ..

cd ooi_editor
"C:\Program Files\7-Zip\7z.exe" a -mx9 -r -tzip ..\ooi_editor.wgt *.* -x!README.md
cd ..

cd ooi_viewer
"C:\Program Files\7-Zip\7z.exe" a -mx9 -r -tzip ..\ooi_viewer.wgt *.* -x!README.md
cd ..

cd openlayers
"C:\Program Files\7-Zip\7z.exe" a -mx9 -r -tzip ..\openlayers.wgt *.* -x!README.md
cd ..

cd tabular
"C:\Program Files\7-Zip\7z.exe" a -mx9 -r -tzip ..\tabular.wgt *.* -x!README.md
cd ..

cd listener
"C:\Program Files\7-Zip\7z.exe" a -mx9 -r -tzip ..\listener.wgt *.* -x!README.md
cd ..