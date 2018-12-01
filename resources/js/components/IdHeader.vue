<template>

	<div class="flex mb-3">
	    <h3 class="mr-3 text-base text-80 font-bold">Hashids Converter</h3>

	    <select
	        v-if="showSelection"
	        @change="$emit('selected', $event.target.value)"
	        class="ml-auto min-w-24 h-6 text-xs no-appearance bg-40"
	    >
	        <option
	            v-for="(option, index) in selection"
	            :key="index"
	            :value="option"
	            v-text="jsUcfirst(option)"
	        >
	        </option>
	    </select>
	</div>

</template>
<script>
	export default{
		props:{
			showSelection: {type: Boolean, required: true},
			selection: {type: Array, required: true},
		},
		methods:{
			jsUcfirst(string){
			    return string.charAt(0).toUpperCase() + string.slice(1);
			},
		},
		
	}
</script>