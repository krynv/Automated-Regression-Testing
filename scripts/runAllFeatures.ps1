param(
        [Parameter(
                    Mandatory=$true,
                    Position=0,
                    HelpMessage='Set path variable for feature folder')]
        [string] $featureFolder,
        
        [Parameter(
                    Mandatory=$true,
                    Position=1,
                    HelpMessage='Set path variable for \tests\features folder')]
        [string] $protractorFeaturesFolder,
        
        [Parameter(
                    Mandatory=$true,
                    Position=2,
                    HelpMessage='Set path variable for protractor_base')]
        [string] $protractorBase,

        [Parameter(
                    Mandatory=$true,
                    Position=3,
                    HelpMessage='Set environment')]
        [string] $environment,

        [Parameter(
                    Mandatory=$true,
                    Position=4,
                    HelpMessage='Set browser')]
        [string] $browser,

        [Parameter(
                    Mandatory=$true,
                    Position=5,
                    HelpMessage='Set testNumber')]
        [int] $testNumber,

        [Parameter(
                    Mandatory=$true,
                    Position=6,
                    HelpMessage='Set testName')]
        [string] $testName,

        [Parameter(
                    Mandatory=$true,
                    Position=7,
                    HelpMessage='Set workspace')]
        [string] $workSpace
)

$ConfirmPreference = 'None'

Write-Host "Installing node_modules..."

npm install
npm install protractor@5.1.2
npm install -g protractor
npm install -g mocha

$J = Invoke-WebRequest -Uri $workSpace/package.json | ConvertFrom-Json
$json = $J.devDependencies -split ";"

$arr = Get-ChildItem $workSpace/node_modules |
       Where-Object {$_.PSIsContainer} |
       Foreach-Object {$_.Name}

foreach($dependency in $json){
    $dependency = $dependency -replace '[=.{}^@1234567890 ]',''
    $exists = $False
    foreach($folder in $arr){
        if($folder -eq $dependency){
            $exists = $True
        }
    }
    if(-Not $exists){
        Write-Host 'ERROR: Dependency:' $dependency 'NOT found in node_modules'
        Write-Host 'ENDING TEST RUN'
        Exit
    }
}

Write-Host "node_modules Installed Successfully!"

Write-Host "Copying mocha..."

Copy-Item //server/c/hostedFiles/mochawesome-screenshots ../node_modules -Force -Recurse

$certFile = "../node_modules/mochawesome-screenshots/cert.txt"
if(-Not (Test-Path $certFile))
{
    Write-Host "ERROR: NO_CERT_FILE"
    Write-Host "ERROR: mochawesome-screenshots was not successfully copied"
    Exit
}
Write-Host "Copying complete!"

Write-Host "Updating Chrome..."
.\updateChrome.ps1
Write-Host "Updated Chrome!"

Write-Host "Starting Selenium Server..."
.\startServer.bat
Start-Sleep -s 2
$result = $False
Get-Process | where {$_.mainWindowTitle} | ForEach {
    if($_.mainWindowTitle -Match "webdriver"){
        Write-Host "Selenium Server Started!"
        $result = $True
    }
}
if(-Not $result){
        Write-Host "ERROR: Selenium server has not started!"
        Write-Host "ENDING TEST RUN"
        Exit
}

$driverLocation = "../node_modules/protractor/node_modules/webdriver-manager/selenium"
$drivers = Get-ChildItem $driverLocation |
       Foreach-Object {$_.Name}

foreach($driver in $drivers)
{
    if($driver -Match "chrome" -And $driver -Match "exe")
    {
        $d = "`nDRIVER="+$driver
        $d = $d -replace '[ ]',''
        Add-Content ../env.properties $d
    }
}


Start-Sleep -s 10

cd $featureFolder

New-Item -ItemType Directory -Force -Path ../tests/features

cd $protractorFeaturesFolder
       
#get the name of each folder in the feature folder
$arr = Get-ChildItem $featureFolder | 
       Where-Object {$_.PSIsContainer} |
       Foreach-Object {$_.Name}

#iterate over each folder in the feature file   
foreach ($folder in $arr)
{
    $a = Get-Date
    [string]$hour = Get-Date -format HH
    [string]$min = Get-Date -format mm
    [string]$sec = Get-Date -format ss
    [string]$time = $hour + "." + $min + "." + $sec
    $date = Get-Date -format yyyy-MM-dd;
    $path =  "//11.111.111.111/C/dashboard/reports/" + $environment + "/" + $folder + "/" + $date;

    cd $protractorFeaturesFolder

    #go into the \tests\features file and remove ALL feature files
    Get-ChildItem -Path $protractorFeaturesFolder -Include *.* -Recurse | foreach { $_.Delete()}
    cd $featureFolder
    cd ..\

    #copy the feature files from the current feature being run into the \tests\features folder
    If($folder -ne "Forge_Testing" -Or $browser -ne "firefox"){
        If(Test-Path feature\$folder\features){
            New-Item -ItemType Directory -Force -Path $path

            copy-item feature\$folder\features tests -force -recurse -verbose

            cd $featureFolder
            cd ..\

            Protractor protractor_$environment.config.js --params.userUsed=mytestingaccount@gmail.com --params.passUsed=myTestingPassword1 --params.browsers="$browser" --params.browserUsed=$browser --params.environmentUsed=$environment --params.testUsed=$folder --params.dateUsed=$date --params.timeUsed=$time --params.dirUsed=//11.111.111.111/C/dashboard/reports/ --params.testNumber=$testNumber --params.testName=$testName
            Start-Sleep -s 10
        } Else {
            Write-Host "ERROR: FEATURES_FOLDER_DOES_NOT_EXIST"
            Write-Host "The folder feature\$folder\features does not exist, skipping test..."
        }
    }
}

start ./scripts/stopServer.sh