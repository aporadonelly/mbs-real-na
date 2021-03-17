import { makeStyles } from '@material-ui/core/styles';
import { colors } from '../../../assets/styleGuide';

const ProductFormStyles = makeStyles(theme => ({
    wysiwygErrorGrid: { marginTop: '1rem !important' },
    quillStyle: {
        [theme.breakpoints.up(1025)]: {
            marginRight: '16.25rem'
        },
        [theme.breakpoints.down(320)]: {
            marginRight: '11.875rem'
        },
        '& .ql-toolbar': {
            backgroundColor: `${colors.quillBackColor} !important`,
            padding: '10px',
            borderRadius: '0.4rem 0.4rem 0 0'
        },
        '& .ql-container': {
            height: '30vh'
        },
        width: '100%'
    },
    selectValidator: {
        '& div>div': {
            padding: '0.7rem'
        }
    },
    backBtn: {
        padding: '0 !important',
        margin: '0.75rem 0',
        '&:hover': {
            backgroundColor: 'transparent !important'
        }
    },
    addBtn: {
        color: colors.text,
        marginRight: '0.5rem'
    },
    removeBtn: {
        position: 'absolute',
        top: '1.25rem'
    },
    separator: {
        borderBottom: 'rgba(0, 0, 0, 0.1) solid 0.1px',
        marginTop: '1rem !important',
        marginBottom: '1rem !important'
    }
}));
export default ProductFormStyles;
