<template>
	<div>
	
		<div class="flex mb-3">
		    <div class="w-3/7">
		        <input 
		            id="hashid" 
		            dusk="hashid" 
		            type="text" 
		            placeholder="Hashid" 
		            class="w-full form-control form-input form-input-bordered"
		            :value="ids.hashId"
		            @input="emitUpdate($event.target.value, '')"
		        >
		    </div>
		    <div class="w-1/7 flex items-center">
		        <svg 
		            xmlns="http://www.w3.org/2000/svg" 
		            viewBox="0 0 24 24"
		            width="20"
		            height="20" 
		            class="mx-2"
		        >
		            <path 
		                fill="var(--sidebar-icon)"
		                class="heroicon-ui" 
		                d="M5.41 16H18a2 2 0 0 0 2-2 1 1 0 0 1 2 0 4 4 0 0 1-4 4H5.41l2.3 2.3a1 1 0 0 1-1.42 1.4l-4-4a1 1 0 0 1 0-1.4l4-4a1 1 0 1 1 1.42 1.4L5.4 16zM6 8a2 2 0 0 0-2 2 1 1 0 0 1-2 0 4 4 0 0 1 4-4h12.59l-2.3-2.3a1 1 0 1 1 1.42-1.4l4 4a1 1 0 0 1 0 1.4l-4 4a1 1 0 0 1-1.42-1.4L18.6 8H6z"/>
		        </svg>
		    </div>
		    <div class="w-3/7">
		        <input 
		            id="normalid" 
		            dusk="normalid" 
		            type="number" 
		            placeholder="Model Id" 
		            class="w-full form-control form-input form-input-bordered"
		            :value="ids.modelId"
		            @input="emitUpdate('', $event.target.value)"
		        >
		    </div>

		</div>

		<div class="flex">
		    <button 
		        type="button" 
		        class="btn btn-default bg-40 text-80 hover:bg-50 ml-auto" 
		        dusk="convert-button"
		        @click="$emit('convert')"
		    >
		        Convert
		    </button>
		</div>

	</div>
</template>
<script>
	export default {
		props:{
			ids: {type: Object, required: true},
		},
		methods:{
			emitUpdate(hashId, modelId){
				this.$emit('update', {
					hashId,
					modelId
				});
			},
		}
	}
</script>