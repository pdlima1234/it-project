
# Deployment Manual

1. Log into your Digital Ocean account
    1. If you do not have access to an account, click “Sign in with Github” using the Github with the WeConnect Repository stored

![image](https://github.com/lezhou8/it-project-team-34/assets/108723117/76f81800-4304-4ebd-a1e0-8714561d16a3)


2. Navigate to the “Apps” page and select the “Create App” button

![image](https://github.com/lezhou8/it-project-team-34/assets/108723117/ab700462-48e6-4462-a7a5-d4e347ac6811)


3. Select the WeConnect Repository and enter "back_end" as the source directory
    1. In the case you cannot see the repository either
        1. Select “Manage Access” if you are a new user
        2. Select “Edit Your Github Permissions” if you are a returning user

![image](https://github.com/lezhou8/it-project-team-34/assets/108723117/bfdc8a71-b46d-4579-881a-201b9b2a5948)


4. Select “Edit” under the Global environment variables section

![image](https://github.com/lezhou8/it-project-team-34/assets/108723117/9a7920b6-670d-49b5-81a4-3a3f852127ff)

5. Add the following keys shown in the image below
    1. DATABASE_URL should be set to your MongoDB key - this key can be found by following the connecting your mongoDB manual
    2. BACK_END_LISTENING_PORT = 8080
    3. SECRET = <”secretkey”> - any arbitrary key that should be kept hidden by the team

![image](https://github.com/lezhou8/it-project-team-34/assets/108723117/96298966-9735-4b0c-8055-37d24ac2e92b)


6.  Click “Next” and proceed to the “Review” section to finalise

![image](https://github.com/lezhou8/it-project-team-34/assets/108723117/18c5eccb-3dca-463d-912b-313b70dc22de)

7.  Using the URL of the site you just deployed, move over to the source code file Constants.ts and modify the BaseUrl to the new URL

![image](https://github.com/lezhou8/it-project-team-34/assets/108723117/00225867-f01f-4162-b857-560fbd22dfce)

8.  Stage, Commit and Push this modification

9.  Repeat steps 2-6, creating a new app using "front_end" as the source directory

10.  You may now run the website using the URL of the front_end app :)
