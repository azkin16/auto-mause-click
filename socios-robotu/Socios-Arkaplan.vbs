Set FSO = CreateObject("Scripting.FileSystemObject")
currentDir = FSO.GetParentFolderName(WScript.ScriptFullName)
batPath = FSO.BuildPath(currentDir, "otomatik_baslat.bat")

Set WshShell = CreateObject("WScript.Shell")
WshShell.Run Chr(34) & batPath & Chr(34), 0

Set WshShell = Nothing
Set FSO = Nothing
