<template>
  <sidebar />
  <main class="main-content position-relative max-height-vh-100 h-100 border-radius-lg ">
    <navbar />
    <div class="container-fluid py-4">
      <div class="row">
        <div class="col-12">
          <div class="card my-4" style="margin-top: 105px !important;">
            <div class="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
              <div class="bg-gradient-primary shadow-primary border-radius-lg pt-4 pb-3">
                <h6 class="text-white text-capitalize ps-3" style="text-align: center; padding-left: 0 !important;">Change Profile Picture</h6>
              </div>
            </div>
            <div class="card-body px-0 pb-2">
              <div class="table-responsive p-0" style="padding: 5px !important;">
                <Form role="form" @submit="changeUserPicture" @invalid-submit="removeErrors">
                  <div style="padding-left: 10px; padding-right: 10px; padding-bottom: 10px;">
                    <div class="input-group input-group-outline my-3" style="margin-top: 0 !important; margin-bottom: 0 !important;">
                      <label for="image">Profile Picture</label>
                      <Field id="image" type="file" class="dropify" data-height="150" name="image" tabindex="-1" @blur="removeImageError" />
                      <span id="image_error" class="error" role="alert">{{$store.getters.getImageError}}</span>
                    </div>
                    <div style="margin-top: 10px; text-align: center;" v-if="$store.getters.getProgress">
                      <strong style="font-size: 0.75rem; color: #E91E63;">UPLOADING FILE</strong>
                      <div class="progress" style="height: 20px; border-radius: 15px;">
                        <div class="progress-bar" role="progressbar" style="height: 20px; border-radius: 15px;" :style="{width: Math.round($store.getters.getProgress) + '%'}">{{Math.round($store.getters.getProgress) + '%'}}</div>
                      </div>
                    </div>
                    <div class="text-center">
                      <button type="submit" class="btn bg-gradient-primary w-100 my-4 mb-2" style="width: 192px !important;">Change</button>
                    </div>
                    <div class="text-center">
                      <router-link class="btn bg-gradient-primary w-100 my-4 mb-2" style="width: 192px !important; margin-top: 15px !important;" :to="{name: 'userProfile'}">Cancel</router-link>
                    </div>
                  </div>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
<script>
  import { onBeforeMount, onMounted, onUnmounted } from 'vue';
  import { Form, Field } from 'vee-validate';
  import $ from 'jquery';
  import { useStore } from 'vuex';
  import materialDashboard from "../../../../../js/materialDashboard";
  import profile from "../../../../../js/composables/profile";
  import sidebar from '../../../../components/pages/user/partials/sidebar.vue';
  import navbar from '../../../../components/pages/user/partials/navbar.vue';
  export default{
    components: {
      sidebar,
      navbar,
      Form,
      Field
    },
    setup(){
      const store = useStore()
      const { changePicture } = profile()
      onBeforeMount(
        async() => {
          const { checkAuthentication } = profile()
          await checkAuthentication()
        }
      )
      onMounted(
        async() => {
          document.getElementById('body').className = 'g-sidenav-show  bg-gray-200'
          const { usePerfectScrollbar, useToggleSidebar } = materialDashboard()
          usePerfectScrollbar()
          useToggleSidebar()
          $('.dropify').dropify({
            tpl: {
              wrap: '<div id="dropify-wrapper" class="dropify-wrapper"></div>'
            },
            imgFileExtensions: ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp']
          });

          if('ontouchstart' in window) {
            document.getElementById('dropify-wrapper').classList.remove('touch-fallback')
          }

          document.getElementById('image').setAttribute('title', '')
        }
      )
      const changeUserPicture = async(values, { resetForm }) => {
        const type_profile = 'user-profile'
        store.dispatch('removeImageError')
        await changePicture(values, type_profile)
        $('.dropify-clear').click()
        resetForm({
          values: {
            image: document.getElementById('image').files[0]
          }
        })
        setTimeout(async() => {
          let image_error = document.getElementById('image_error')
          if(image_error){
            image_error.style.display = 'block'
          }
        }, 15)
      }
      const removeImageError = async() => {
        setTimeout(async() => {
          let image_error = document.getElementById('image_error')
          if(image_error){
            image_error.style.display = 'none'
          }
        }, 10)
      }
      const removeErrors = async() => {
        store.dispatch('removeImageError')
      }
      onUnmounted(
        async() => {
          document.getElementById('body').removeAttribute('class')
          store.dispatch('removeImageError')
        }
      )
      return{
        changeUserPicture,
        removeImageError,
        removeErrors
      }
    }
  }
</script>