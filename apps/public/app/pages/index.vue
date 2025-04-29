<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Home</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-grid>
        <ion-row class="ion-justify-content-center ion-align-items-center">
          <ion-col>
            <div>
              <h1>
                Hello World, this is a live reload test, now changing some shit
              </h1>
              <h2>
                This should be a sub text
              </h2>
              <h3>
                And this an h3333
              </h3>
              <ion-button router-link="/login">
                Go to login
              </ion-button>
            </div>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
    <ion-footer>
      <ion-toolbar>
        <ion-title>Footer</ion-title>
      </ion-toolbar>
    </ion-footer>
  </ion-page>
</template>
