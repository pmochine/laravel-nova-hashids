<template>
    <loading-card 
        :loading="loading" 
        class="metric px-6 py-4 relative"
    >  

        <id-header
            :show-selection="showConverter"
            :selection="selection"
            @selected="handleSelected"
        ></id-header>

        <id-converter
            v-if="showConverter"
            :ids="ids"
            @update="ids = $event"
            @convert="convert"
        ></id-converter>

        <id-empty
            v-if="empty"
        ></id-empty>

        <id-error
            v-if="error"
        ></id-error>


    </loading-card>

</template>

<script>
    import IdHeader from './IdHeader';
    import IdConverter from './IdConverter';
    import IdEmpty from './IdEmpty';
    import IdError from './IdError';


    export default {
        data(){
            return {
                error: false,
                empty: false,
                loading: true,
                selection: [],
                selected: '',
                ids:{
                    hashId: '',
                    modelId: ''
                }
                
            };
        },
        components:{
            IdHeader,
            IdConverter,
            IdEmpty,
            IdError
        },
        computed:{
            url(){
                return '/nova-vendor/laravel-nova-hashids/hashids';
            },
            showConverter(){
                return this.selection.length > 0 
                    && ! this.error
                    && ! this.empty;
            }
        },
        methods:{
            config(){
                Nova.request()
                    .get(this.url)
                    .then(this.setConfig)
                    .catch(this.setError)
                    .finally(this.setLoading);
            },
            setConfig({data}){
                if(data.status == 'empty'){
                    return this.empty = true;
                }
                this.selected = data.default;
                this.selection = data.selection;
            },
            setLoading(bool = false){
                this.loading = bool;
            },
            setError(){
                this.error = true;
            },
            handleSelected(selected){
                this.selected = selected;
                this.convert();
            },
            convert(){
                this.setLoading(true);

                Nova.request()
                    .post(this.url, {
                        ...this.ids,
                        'selected': this.selected
                    })
                    .then(this.showConvertedId)
                    .catch(this.setError)
                    .finally(this.setLoading);
            },
            showConvertedId({data}){
                if(data.status == 'empty'){
                    return;
                }
                this.ids[data.status] = data.value;
            },

        },

        mounted() {
            this.config();
        },
    }
</script>
