<template>
  <nav class="navbar is-dark" role="navigation" aria-label="main navigation">
    <div class="container">
      <div class="navbar-brand">
        <router-link class="navbar-item is-size-5" to="/">
          <strong>OKBOT</strong>
        </router-link>

        <a
          role="button"
          class="navbar-burger burger"
          aria-label="menu"
          aria-expanded="false"
          data-target="navbarBasicExample"
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>

      <div id="main-nav" class="navbar-menu">
        <div class="navbar-start">
          <router-link to="/announce" active-class="is-active" class="navbar-item">Nové oznámení</router-link>
          <router-link to="/poll" active-class="is-active" class="navbar-item">Nové hlasování</router-link>
        </div>
        <div class="navbar-end">
          <div class="navbar-item">
            <div class="buttons">
              <a class="button is-danger">Odhlásit se</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>
